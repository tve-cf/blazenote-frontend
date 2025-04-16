import React from 'react';
import { X, Copy, Plus, Check, Sparkles, ChevronDown } from 'lucide-react';

interface Language {
  code: string;
  name: string;
}

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
  result?: string;
  onCopy?: () => void;
  onInsert?: () => void;
  onCreateNew?: () => void;
  onApplyTitle?: () => void;
  selectedAction?: 'summarize' | 'paraphrase' | 'translate' | 'title' | null;
  fromLanguage?: string;
  toLanguage?: string;
  onFromLanguageChange?: (lang: string) => void;
  onToLanguageChange?: (lang: string) => void;
  languages?: Language[];
  onTranslate?: () => void;
}

export function AiDialog({
  isOpen,
  onClose,
  title,
  children,
  isLoading,
  result,
  onCopy,
  onInsert,
  onCreateNew,
  onApplyTitle,
  selectedAction,
  fromLanguage,
  toLanguage,
  onFromLanguageChange,
  onToLanguageChange,
  onTranslate
}: DialogProps) {
  if (!isOpen) return null;

  const languages = [
    { value: 'english', name: 'English' },
    { value: 'spanish', name: 'Spanish' },
    { value: 'french', name: 'French' },
    { value: 'german', name: 'German' },
    { value: 'italian', name: 'Italian' },
    { value: 'portuguese', name: 'Portuguese' },
    { value: 'russian', name: 'Russian' },
    { value: 'chinese', name: 'Chinese' },
    { value: 'japanese', name: 'Japanese' },
    { value: 'korean', name: 'Korean' }
  ];

  // Clean up result content by removing unwanted whitespaces and empty paragraph tags
  const cleanResult = (content: string): string => {
    if (!content) return '';

    // Trim whitespace
    let cleaned = content.trim();

    // Remove empty paragraph tags at the beginning
    cleaned = cleaned.replace(/^(<p>\s*<\/p>)+/g, '');
    cleaned = cleaned.replace(/^(<p>\s*)+/g, '<p>');

    // Remove excessive newlines at the beginning
    cleaned = cleaned.replace(/^\n+/, '');
    cleaned = cleaned.replace(/<p>&nbsp;<\/p>/g, '');

    // AI system messages
    cleaned = cleaned.replace(/assistant<|header_end|>/, '');
    cleaned = cleaned.replace(/<\|.*?\|>/g, '');

    return cleaned;
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {!result && !isLoading && !selectedAction && (
            <div className="space-y-4">{children}</div>
          )}

          {selectedAction === 'translate' && !result && !isLoading && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From
                  </label>
                  <div className="relative">
                    <select
                      value={fromLanguage}
                      onChange={(e) => onFromLanguageChange?.(e.target.value)}
                      className="w-full pl-3 pr-10 py-2 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    >
                      {languages.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To
                  </label>
                  <div className="relative">
                    <select
                      value={toLanguage}
                      onChange={(e) => onToLanguageChange?.(e.target.value)}
                      className="w-full pl-3 pr-10 py-2 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    >
                      {languages
                        .filter((lang) => lang.value !== 'auto')
                        .map((lang) => (
                          <option key={lang.value} value={lang.value}>
                            {lang.name}
                          </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              <button
                onClick={onTranslate}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Check className="h-4 w-4" />
                Translate
              </button>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600"></div>
              <p className="text-gray-500">Processing your request...</p>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 max-h-[400px] overflow-y-auto">
                <div
                  className="text-gray-700 prose max-w-none break-words leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: cleanResult(result) }}
                />
              </div>

              {selectedAction === 'title' ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={onCopy}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </button>
                  <button
                    onClick={onApplyTitle}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    Apply Title
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={onCopy}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </button>
                  <button
                    onClick={onInsert}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    Insert
                  </button>
                  <button
                    onClick={onCreateNew}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    New Note
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
