interface PostButtonProps {
  onPost: () => void;
  disabled?: boolean;
}

export default function PostButton({ onPost, disabled = false }: PostButtonProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-blue-700 font-medium">Response ready to post</span>
      <button
        onClick={onPost}
        disabled={disabled}
        className={`px-4 py-1.5 rounded-lg font-medium flex items-center ${
          disabled
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-green-500 text-white hover:bg-green-600'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
        Post Response
      </button>
    </div>
  );
} 