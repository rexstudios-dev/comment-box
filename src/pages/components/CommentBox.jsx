import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function UiComment() {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('/avatar.svg');
  const [customName, setCustomName] = useState('User');
  const [showAvatars, setShowAvatars] = useState(true);

  useEffect(() => {
    fetch('/api/comments')
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, []);

  const handleAddComment = async () => {
    const newComment = {
      author: customName,
      timestamp: new Date().toLocaleString(),
      content: newCommentText,
      avatar: selectedAvatar,
    };

    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newComment),
    });

    if (res.ok) {
      const updatedComments = await res.json();
      setComments(updatedComments);
      setNewCommentText('');
    }
  };

  const toggleAvatars = () => {
    setShowAvatars(!showAvatars);
    setSelectedAvatar('/avatar.svg');
  };

  const avatarList = showAvatars
    ? Array.from({ length: 12 }, (_, i) => `/avatar${i + 1}.svg`)
    : Array.from({ length: 12 }, (_, i) => `/animal${i + 1}.svg`);
  return (
    <div className="bg-[#cfe8f3] p-4 md:p-8 flex flex-col">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-secondary text-secondary-foreground rounded-full p-2 hover:bg-secondary/80"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col">
          <textarea
            className="flex min-h-[80px] rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full border-none p-0 focus:ring-0"
            placeholder="Type your comment here..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
          ></textarea>
          <button
            onClick={handleAddComment}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 mt-2 self-end"
          >
            Add new comment
          </button>
        </div>
        {comments.map((comment, index) => (
          <div key={index} className="bg-white p-4 md:p-6 rounded-lg shadow-md flex flex-col md:flex-row items-start md:items-center space-x-0 md:space-x-4">
            <div>
              <Image
                className="h-12 w-12 md:h-16 md:w-16 rounded-full"
                src={comment.avatar}
                alt="Avatar"
                width={48}
                height={48}
              />
            </div>
            <div className="flex-1 mt-2 md:mt-0">
              <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-xl font-semibold">
                  {comment.author}
                </h3>
              </div>
              <p className="text-base md:text-lg text-gray-700 mt-1">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Adjust Settings</h2>
            <div className="flex justify-center mb-4">
              <button
                onClick={toggleAvatars}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2"
              >
                {showAvatars ? 'Show Animals' : 'Show Avatars'}
              </button>
            </div>
            <input
              type="text"
              className="borderborder-gray-300 rounded-md p-2 w-full mb-4"
              placeholder="Enter your name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-secondary text-secondary-foreground rounded-md px-4 py-2"
              >
                Save
              </button>
            </div>
            <div className="flex justify-center mt-4 space-x-4">
              {avatarList.map((avatar, index) => (
                <span key={index} className="relative">
                  <Image
                    className="aspect-square h-12 w-12 sm:h-16 sm:w-16 cursor-pointer" // Utilizando clases responsivas
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    width={48}
                    height={48}
                    onClick={() => setSelectedAvatar(avatar)}
                  />
                  {avatar === selectedAvatar && (
                    <span className="absolute top-0 right-0 block w-3 h-3 bg-blue-500 rounded-full"></span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
//By Rex Dev Discord: RexDev#6598