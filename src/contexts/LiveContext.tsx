import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LiveStream {
  id: string;
  title: string;
  thumbnail: string;
  streamer: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  viewers: number;
  isLive: boolean;
  category: string;
  startTime: string;
  description: string;
  tags: string[];
}

interface LiveContextType {
  liveStreams: LiveStream[];
  currentStream: LiveStream | null;
  isStreaming: boolean;
  startStream: (streamData: Omit<LiveStream, 'id' | 'viewers' | 'isLive' | 'startTime'>) => void;
  endStream: () => void;
  joinStream: (streamId: string) => void;
  leaveStream: () => void;
}

const LiveContext = createContext<LiveContextType | undefined>(undefined);

export const useLive = () => {
  const context = useContext(LiveContext);
  if (!context) {
    throw new Error('useLive must be used within a LiveProvider');
  }
  return context;
};

const mockLiveStreams: LiveStream[] = [
  {
    id: '1',
    title: 'آموزش برنامه‌نویسی React - پخش زنده',
    thumbnail: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=800',
    streamer: {
      id: 'str1',
      name: 'کدنویس حرفه‌ای',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: true
    },
    viewers: 1250,
    isLive: true,
    category: 'Technology',
    startTime: '2024-01-15T10:00:00Z',
    description: 'آموزش کامل React از صفر تا صد',
    tags: ['react', 'programming', 'tutorial', 'live']
  },
  {
    id: '2',
    title: 'بازی FIFA 24 - مسابقه زنده',
    thumbnail: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800',
    streamer: {
      id: 'str2',
      name: 'گیمر پرو',
      avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100',
      verified: true
    },
    viewers: 3420,
    isLive: true,
    category: 'Gaming',
    startTime: '2024-01-15T14:30:00Z',
    description: 'مسابقه آنلاین FIFA 24',
    tags: ['fifa', 'gaming', 'live', 'competition']
  }
];

export const LiveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>(mockLiveStreams);
  const [currentStream, setCurrentStream] = useState<LiveStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const startStream = (streamData: Omit<LiveStream, 'id' | 'viewers' | 'isLive' | 'startTime'>) => {
    const newStream: LiveStream = {
      ...streamData,
      id: Date.now().toString(),
      viewers: 0,
      isLive: true,
      startTime: new Date().toISOString()
    };

    setLiveStreams(prev => [newStream, ...prev]);
    setCurrentStream(newStream);
    setIsStreaming(true);
  };

  const endStream = () => {
    if (currentStream) {
      setLiveStreams(prev => 
        prev.map(stream => 
          stream.id === currentStream.id 
            ? { ...stream, isLive: false }
            : stream
        )
      );
      setCurrentStream(null);
      setIsStreaming(false);
    }
  };

  const joinStream = (streamId: string) => {
    const stream = liveStreams.find(s => s.id === streamId);
    if (stream) {
      setCurrentStream(stream);
      // Increment viewer count
      setLiveStreams(prev => 
        prev.map(s => 
          s.id === streamId 
            ? { ...s, viewers: s.viewers + 1 }
            : s
        )
      );
    }
  };

  const leaveStream = () => {
    if (currentStream) {
      // Decrement viewer count
      setLiveStreams(prev => 
        prev.map(s => 
          s.id === currentStream.id 
            ? { ...s, viewers: Math.max(0, s.viewers - 1) }
            : s
        )
      );
      setCurrentStream(null);
    }
  };

  const value = {
    liveStreams,
    currentStream,
    isStreaming,
    startStream,
    endStream,
    joinStream,
    leaveStream
  };

  return (
    <LiveContext.Provider value={value}>
      {children}
    </LiveContext.Provider>
  );
};