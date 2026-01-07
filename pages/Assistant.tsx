import React, { useState, useRef, useMemo } from 'react';
import { Upload, Loader2, Wand2, Copy, Check, Braces, Type, X, RefreshCw } from 'lucide-react';
import { Header } from '../components/Header';
import { reverseEngineerImage } from '../services/geminiService';
import { clsx } from 'clsx';
import { parsePrompt } from '../utils/promptParser';
import { ParsedPrompt } from '../types';

export const Assistant: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'json'>('text');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setGeneratedPrompt('');
        setActiveTab('text');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image || !mimeType) return;
    setLoading(true);
    try {
      const prompt = await reverseEngineerImage(image, mimeType);
      setGeneratedPrompt(prompt);
    } catch (e) {
      setGeneratedPrompt("Error analyzing image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setMimeType('');
    setGeneratedPrompt('');
    setLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Derive parsed data from the generated text prompt
  const parsedData: ParsedPrompt | null = useMemo(() => {
    if (!generatedPrompt) return null;
    return parsePrompt(generatedPrompt);
  }, [generatedPrompt]);

  const handleCopy = () => {
    let contentToCopy = generatedPrompt;
    
    if (activeTab === 'json' && parsedData) {
        contentToCopy = JSON.stringify(parsedData, null, 2);
    }

    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const FIELD_LABELS: Record<keyof ParsedPrompt, string> = {
    imageType: 'Image Type',
    object: 'Subject / Object',
    background: 'Background',
    style: 'Style',
    lighting: 'Lighting',
    texture: 'Texture',
    details: 'Details',
    aspectRatio: 'Aspect Ratio'
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="container mx-auto mt-12 max-w-4xl px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Reverse Engineer</h1>
          <p className="text-slate-400">Upload an image to extract its prompt DNA using Gemini Vision.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Left Column: Upload */}
          <div className="space-y-4">
            <div 
              onClick={() => !image && fileInputRef.current?.click()}
              className={clsx(
                "relative flex aspect-square flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all",
                image 
                  ? "border-primary/50 bg-slate-900/40 cursor-default" 
                  : "border-slate-800 bg-slate-900/20 hover:bg-slate-900/50 hover:border-primary/30 cursor-pointer"
              )}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange} 
              />
              
              {image ? (
                <>
                  <img 
                    src={image} 
                    alt="Upload preview" 
                    className="absolute inset-0 h-full w-full rounded-2xl object-cover opacity-80" 
                  />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReset();
                    }}
                    className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-red-500/80 text-white rounded-full backdrop-blur-sm transition-colors"
                    title="Remove Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center text-slate-500">
                  <Upload className="mb-4 h-12 w-12" />
                  <span className="text-sm font-medium">Click to upload reference</span>
                </div>
              )}
            </div>

            {generatedPrompt ? (
               <button
                 onClick={handleReset}
                 className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/10 px-6 py-4 font-bold text-white transition-all hover:bg-white/20 hover:border-white/20"
               >
                 <RefreshCw className="w-4 h-4 transition-transform group-hover:rotate-180" />
                 Analyze New Image
               </button>
            ) : (
              <button
                onClick={handleAnalyze}
                disabled={!image || loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-4 font-bold text-slate-950 transition-all hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Wand2 className="transition-transform group-hover:rotate-12" />}
                {loading ? "Analyzing..." : "Generate Prompt"}
              </button>
            )}
          </div>

          {/* Right Column: Result */}
          <div className="relative flex flex-col rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-sm p-6 shadow-2xl h-[500px]">
            <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-4 shrink-0">
               <div className="flex space-x-1 bg-white/5 p-1 rounded-lg border border-white/5">
                 <button
                   onClick={() => setActiveTab('text')}
                   className={clsx(
                     "flex items-center px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all",
                     activeTab === 'text' ? "bg-white/10 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                   )}
                 >
                   <Type className="w-3 h-3 mr-2" /> Text
                 </button>
                 <button
                   onClick={() => setActiveTab('json')}
                   className={clsx(
                     "flex items-center px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all",
                     activeTab === 'json' ? "bg-white/10 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                   )}
                 >
                   <Braces className="w-3 h-3 mr-2" /> JSON
                 </button>
               </div>
              
              {generatedPrompt && (
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:text-white transition-colors"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {generatedPrompt ? (
                <>
                    {/* Text View */}
                    <div className={clsx("transition-opacity duration-300", activeTab === 'text' ? "block" : "hidden")}>
                        <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-200">
                        {generatedPrompt}
                        </p>
                    </div>

                    {/* JSON View */}
                    <div className={clsx("transition-opacity duration-300 space-y-6 pb-2", activeTab === 'json' ? "block" : "hidden")}>
                        {parsedData && (
                            <>
                                <div className="grid grid-cols-1 gap-3">
                                    {(Object.keys(parsedData) as Array<keyof ParsedPrompt>).map((key) => (
                                        parsedData[key] && (
                                            <div key={key} className="space-y-1">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-primary/80 ml-1">
                                                    {FIELD_LABELS[key] || key}
                                                </span>
                                                <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-300">
                                                    {parsedData[key]}
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                                
                                <div className="mt-4 rounded-lg bg-black/40 border border-white/10 overflow-hidden">
                                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 border-b border-white/5">
                                        <Braces className="w-3 h-3 text-accent" />
                                        <span className="text-[10px] font-bold uppercase text-slate-500">Raw JSON</span>
                                    </div>
                                    <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto custom-scrollbar leading-relaxed opacity-90">
                                        {JSON.stringify(parsedData, null, 2)}
                                    </pre>
                                </div>
                            </>
                        )}
                    </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center text-slate-600">
                  <Wand2 className="mb-4 h-10 w-10 opacity-20" />
                  <p className="text-sm">Ready to analyze.<br/>Upload an image to begin.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};