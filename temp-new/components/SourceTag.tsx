import { Message } from '../types';

interface SourceTagProps {
  source: Message['source'];
}

export default function SourceTag({ source }: SourceTagProps) {
  if (!source) return null;

  const getSourceColor = (type: string) => {
    switch (type) {
      case 'faq':
        return 'bg-blue-100 text-blue-800';
      case 'doc':
        return 'bg-green-100 text-green-800';
      case 'rule':
        return 'bg-purple-100 text-purple-800';
      case 'ai':
        return 'bg-amber-100 text-amber-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'system':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // For system welcome message, don't show the source tag
  if (source.type === 'system' && source.id === 'welcome') {
    return null;
  }

  return (
    <div className="mt-2">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSourceColor(source.type)}`}>
        {source.type.toUpperCase()}: {source.title}
      </span>
    </div>
  );
} 