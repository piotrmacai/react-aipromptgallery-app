import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Type, Braces } from 'lucide-react';
import { ArtPromptItem, ParsedPrompt } from '../types';
import { parsePrompt, constructPrompt } from '../utils/promptParser';
import { clsx } from 'clsx';

interface PromptModalProps {
  item: ArtPromptItem;
  onClose: () => void;
}

// Field definition for the Form Generator
const FORM_FIELDS: { key: keyof ParsedPrompt; label: string; placeholder: string }[] = [
  { key: 'imageType', label: 'Image Type', placeholder: 'e.g. Portrait, Editorial photo' },
  { key: 'object', label: 'Subject / Object', placeholder: 'e.g. a cyborg warrior' },
  { key: 'background', label: 'Background', placeholder: 'e.g. in a neon city' },
  { key: 'style', label: 'Style', placeholder: 'e.g. Cyberpunk, Synthwave' },
  { key: 'lighting', label: 'Lighting', placeholder: 'e.g. Cinematic, Volumetric' },
  { key: 'texture', label: 'Texture', placeholder: 'e.g. Detailed skin, metal' },
  { key: 'details', label: 'Details', placeholder: 'e.g. 8k, sharp focus' },
  { key: 'aspectRatio', label: 'Aspect Ratio', placeholder: 'e.g. 4:5, 16:9' },
];

export const PromptModal: React.FC<PromptModalProps> = ({ item, onClose }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'structure'>('text');
  const [copied, setCopied] = useState(false);

  // Local State for Two-Way Binding
  const [localPromptText, setLocalPromptText] = useState(item.prompt);
  const [localParsedData, setLocalParsedData] = useState<ParsedPrompt>(() => parsePrompt(item.prompt));

  // Handler: When user types in Text Area
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setLocalPromptText(newText);
    // Auto-update the JSON structure based on new text
    setLocalParsedData(parsePrompt(newText));
  };

  // Handler: When user edits a Form Input
  const handleStructureChange = (key: keyof ParsedPrompt, value: string) => {
    const newData = { ...localParsedData, [key]: value };
    setLocalParsedData(newData);
    // Auto-update the Text Prompt based on new structure
    setLocalPromptText(constructPrompt(newData));
  };

  // Reset to original if item changes
  useEffect(() => {
    setLocalPromptText(item.prompt);
    setLocalParsedData(parsePrompt(item.prompt));
  }, [item]);

  const handleCopy = () => {
    let contentToCopy = "";
    
    if (activeTab === 'text') {
        contentToCopy = localPromptText;
    } else {
        // Copy formatted JSON
        contentToCopy = JSON.stringify(localParsedData, null, 2);
    }

    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8">
      <div className="relative w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-background shadow-2xl flex flex-col md:flex-row h-[90vh]">
        
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-black/50 p-2 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Image Section */}
        <div className="relative w-full md:w-1/2 bg-[#020408] flex items-center justify-center overflow-hidden h-1/3 md:h-full group">
            <div 
                className="absolute inset-0 opacity-20 blur-3xl scale-110"
                style={{ 
                    backgroundImage: `url(${item.imageUrl})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center' 
                }} 
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,black)]" />
            <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="relative z-10 h-full w-full object-contain p-4 md:p-8 transition-transform duration-500 group-hover:scale-[1.02]"
            />
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 flex flex-col h-2/3 md:h-full bg-background/95 border-l border-white/5">
          
          <div className="p-6 border-b border-white/5 shrink-0">
            <div className="flex flex-wrap gap-2 mb-3 pr-8">
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary border border-primary/20">
                {item.category}
              </span>
              {item.tags.map(tag => (
                <span key={tag} className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-slate-400 border border-white/5">
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">{item.title}</h2>
            <p className="text-slate-500 text-sm">Edits are temporary and help you experiment.</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="mb-4 flex items-center justify-between">
               <div className="flex space-x-1 bg-white/5 p-1 rounded-lg border border-white/5">
                 <button
                   onClick={() => setActiveTab('text')}
                   className={clsx(
                     "flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                     activeTab === 'text' ? "bg-white/10 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                   )}
                 >
                   <Type className="w-4 h-4 mr-2" /> Text
                 </button>
                 <button
                   onClick={() => setActiveTab('structure')}
                   className={clsx(
                     "flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                     activeTab === 'structure' ? "bg-white/10 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                   )}
                 >
                   <Braces className="w-4 h-4 mr-2" /> JSON
                 </button>
               </div>
               
               <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-slate-950 transition-transform active:scale-95 hover:bg-primary/90"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? (activeTab === 'text' ? "Copied" : "Copied") : (activeTab === 'text' ? "Copy" : "Copy")}
                </button>
            </div>

            {/* TAB CONTENT: TEXT EDITOR */}
            <div className={clsx("transition-opacity duration-300", activeTab === 'text' ? "opacity-100" : "hidden")}>
                <div className="relative rounded-lg border border-white/10 bg-black/40 p-1 group focus-within:border-primary/50 transition-colors">
                    <textarea 
                        value={localPromptText}
                        onChange={handleTextChange}
                        className="w-full h-[300px] bg-transparent p-4 text-sm font-mono text-slate-200 focus:outline-none resize-none leading-relaxed custom-scrollbar selection:bg-primary/30"
                        placeholder="Type your prompt here..."
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-slate-600 pointer-events-none">
                        {localPromptText.length} chars
                    </div>
                </div>
            </div>

            {/* TAB CONTENT: STRUCTURE FORM & JSON VIEW */}
            <div className={clsx("transition-opacity duration-300 space-y-6", activeTab === 'structure' ? "opacity-100" : "hidden")}>
                
                {/* Form Inputs */}
                <div className="grid grid-cols-1 gap-4">
                    {FORM_FIELDS.map((field) => (
                        <div key={field.key} className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                                {field.label}
                            </label> 
                            <input
                                type="text"
                                value={localParsedData[field.key] || ''}
                                onChange={(e) => handleStructureChange(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-sm font-mono text-white placeholder-slate-700 focus:border-primary/50 focus:bg-black/40 focus:outline-none transition-all"
                            />
                        </div>
                    ))}
                </div>
                
                {/* JSON Preview Block */}
                <div className="rounded-lg bg-black/40 border border-white/10 overflow-hidden">
                     <div className="flex items-center gap-2 bg-white/5 px-4 py-2 border-b border-white/5">
                        <Braces className="w-3 h-3 text-accent" />
                        <span className="text-[10px] font-bold uppercase text-slate-500">JSON Object</span>
                     </div>
                     <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto custom-scrollbar leading-relaxed opacity-90">
                        {JSON.stringify(localParsedData, null, 2)}
                     </pre>
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};