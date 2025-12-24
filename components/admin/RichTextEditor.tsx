'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false }) as any;

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
];

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [isPreview, setIsPreview] = React.useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-500">Editor</span>
            <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className="text-sm px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition text-gray-700"
            >
                {isPreview ? 'Switch to Edit' : 'Preview'}
            </button>
        </div>
      
      {isPreview ? (
        <div 
            className="p-4 min-h-[300px] prose max-w-none"
            dangerouslySetInnerHTML={{ __html: value }} 
        />
      ) : (
        <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
            className="h-[300px] mb-12"
        />
      )}
    </div>
  );
}
