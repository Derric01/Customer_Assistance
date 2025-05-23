import { Message } from '../types';
import { 
  FiBookOpen, // For documentation
  FiHelpCircle, // For FAQs
  FiBook, // For Rules
  FiAlertTriangle, // For Escalations
  FiInfo // Default
} from 'react-icons/fi';

interface SourceTagProps {
  source: Message['source'];
}

export default function SourceTag({ source }: SourceTagProps) {
  if (!source) return null;

  const getSourceConfig = (type: string) => {
    switch (type) {
      case 'faq':
        return {
          bgColor: 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30',
          textColor: 'text-blue-700 dark:text-blue-300',
          borderColor: 'border-blue-200 dark:border-blue-800',
          icon: <FiHelpCircle className="w-3 h-3 mr-1" />
        };
      case 'doc':
        return {
          bgColor: 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30',
          textColor: 'text-green-700 dark:text-green-300',
          borderColor: 'border-green-200 dark:border-green-800',
          icon: <FiBookOpen className="w-3 h-3 mr-1" />
        };
      case 'rule':
        return {
          bgColor: 'bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30',
          textColor: 'text-purple-700 dark:text-purple-300',
          borderColor: 'border-purple-200 dark:border-purple-800',
          icon: <FiBook className="w-3 h-3 mr-1" />
        };
      case 'escalation':
        return {
          bgColor: 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30',
          textColor: 'text-red-700 dark:text-red-300',
          borderColor: 'border-red-200 dark:border-red-800',
          icon: <FiAlertTriangle className="w-3 h-3 mr-1" />
        };
      default:
        return {
          bgColor: 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-700/30',
          textColor: 'text-gray-700 dark:text-gray-300',
          borderColor: 'border-gray-200 dark:border-gray-700',
          icon: <FiInfo className="w-3 h-3 mr-1" />
        };
    }
  };

  // For system welcome message, don't show the source tag
  if (source.type === 'system' && source.id === 'welcome') {
    return null;
  }
  
  const config = getSourceConfig(source.type);

  return (
    <div className="mt-3 flex flex-col gap-1.5">
      <div className="flex items-center">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor} shadow-sm`}>
          {config.icon}
          {source.type.toUpperCase()}: {source.title}
        </span>
      </div>
      {source.originalSource && (
        <span className="text-xs flex items-center text-gray-500 dark:text-gray-400 ml-1">
          Source: {source.originalSource}
        </span>
      )}
    </div>
  );
} 