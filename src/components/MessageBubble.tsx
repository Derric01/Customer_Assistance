import { Message } from '../types';
import SourceTag from './SourceTag';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { content, source, timestamp } = message;
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  /**
   * Determines if the current message represents an error
   * @remarks This boolean flag checks if the message's role property is set to 'error'
   * @returns {boolean} True if the message is an error, false otherwise
   */
  const isError = message.role === 'error';

  if (isSystem) {
    return (
      <div className="flex justify-center mb-4">
        <div className="max-w-[90%] rounded-lg px-4 py-3 bg-indigo-50 border border-indigo-100 text-center">
          <p className="text-sm">{content}</p>
          <div className="text-xs text-indigo-400 mt-1">
            {timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
        isUser 
          ? 'bg-blue-500 text-white' 
          : isError
            ? 'bg-red-50 border border-red-100'
            : 'bg-white border border-gray-200 shadow-sm'
      }`}>
        <p className="text-sm">{content}</p>
        {source && <SourceTag source={source} />}
        <div className={`text-xs ${
          isUser 
            ? 'text-blue-200' 
            : isError
              ? 'text-red-400'
              : 'text-gray-500'
        } mt-1`}>
          {timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
} 