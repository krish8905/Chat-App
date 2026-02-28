import { useEffect, useRef, useState } from "react";
import { getChatHistory } from "../../api/chatApi";
import { useTheme } from "../../theme/ThemeContext";
import EmojiPicker from "emoji-picker-react";
import RecordRTC from "recordrtc";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

const DoubleCheckIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
  </svg>
);

const SmileIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S7.33 8 6.5 8 5 8.67 5 9.5 5.67 11 6.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
  </svg>
);

const ReplyIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

const ArrowDownIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const PaperclipIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
  </svg>
);

const VideoIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"></polygon>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
  </svg>
);

const DocumentIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const ImageIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

const MicrophoneIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
);

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const CircleIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
  </svg>
);

export default function ChatRoom({ friend }) {
  const { theme } = useTheme();
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [statusText, setStatusText] = useState("Connecting...");
  const [myUsername, setMyUsername] = useState(localStorage.getItem("username") || "");
  const [friendOnline, setFriendOnline] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ alignLeft: false, alignTop: false });
  const [deleteMessageIds, setDeleteMessageIds] = useState([]);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null); // { id, text, sender }
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState(new Set());
  const [friendTyping, setFriendTyping] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResultIds, setSearchResultIds] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Recording states
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimerRef = useRef(null);
  const rtcRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const previewVideoRef = useRef(null);

  const typingTimeoutRef = useRef(null);
  const myTypingTimeoutRef = useRef(null);
  const lastTypedTimeRef = useRef(0);

  useEffect(() => {
    const handleClick = () => {
      setActiveDropdownId(null);
      setShowAttachmentMenu(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const wsRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!friend || !friend.room_id) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    // Fetch my user details if we don't know our own username
    if (!myUsername) {
      fetch("http://127.0.0.1:8000/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(u => {
          if (u.username) {
            setMyUsername(u.username);
            localStorage.setItem("username", u.username);
          }
        })
        .catch(console.error);
    }

    // Load history
    getChatHistory(friend.room_id)
      .then(msgs => {
        setMessages(msgs || []);
        if (msgs && msgs.length < 50) setHasMore(false);
      })
      .catch(e => console.error("Failed to load history", e));

    const wsUrl = `ws://127.0.0.1:8000/ws/chat/${friend.room_id}?token=${token}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      setStatusText("Connected");
    };

    ws.onclose = () => {
      setConnected(false);
      setStatusText("Disconnected");
    };

    ws.onerror = () => {
      setStatusText("Connection error");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "status") {
          // If the status update is about our friend (using user_id)
          if (data.user_id === friend.id) {
            setFriendOnline(data.status === "online");
          }
        } else if (data.type === "message_status") {
          setMessages((prev) => prev.map(m => (data.msg_ids || []).includes(m.id) ? { ...m, status: data.status } : m));
        } else if (data.type === "delete_messages_for_everyone") {
          setMessages((prev) => prev.filter(m => !(data.msg_ids || []).includes(m.id)));
        } else if (data.type === "delete_message_for_everyone") {
          setMessages((prev) => prev.filter(m => m.id !== data.msg_id));
        } else if (data.type === "typing") {
          if (data.user_id === friend.id) {
            setFriendTyping(true);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => setFriendTyping(false), 3000);
          }
        } else if (data.type === "stop_typing") {
          if (data.user_id === friend.id) {
            setFriendTyping(false);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          }
        } else {
          setMessages((prev) => [...prev, data]);
        }
      } catch { }
    };

    return () => {
      ws.close();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (myTypingTimeoutRef.current) clearTimeout(myTypingTimeoutRef.current);
      stopRecordingCleanup();
    };
  }, [friend, myUsername]); // Added myUsername to dependencies to re-run if it changes

  const stopRecordingCleanup = () => {
    if (rtcRecorderRef.current) {
      rtcRecorderRef.current.destroy();
      rtcRecorderRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setRecordingTime(0);
  };

  useEffect(() => {
    if (searchMode && searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const results = messages
        .filter(m => m.type !== "system" && m.text?.toLowerCase().includes(q))
        .map(m => m.id);
      setSearchResultIds(results);
      if (results.length > 0) {
        let newIndex = currentSearchIndex;
        // Keep index in bounds
        if (newIndex >= results.length) newIndex = results.length - 1;
        if (newIndex < 0) newIndex = 0;
        setCurrentSearchIndex(newIndex);
        scrollToMessage(results[newIndex]);
      } else {
        setCurrentSearchIndex(-1);
      }
    } else {
      setSearchResultIds([]);
      setCurrentSearchIndex(-1);
    }
  }, [searchQuery, searchMode, messages]);

  const goToNextSearchResult = () => {
    if (searchResultIds.length === 0) return;
    const nextIdx = (currentSearchIndex + 1) % searchResultIds.length;
    setCurrentSearchIndex(nextIdx);
    scrollToMessage(searchResultIds[nextIdx]);
  };

  const goToPrevSearchResult = () => {
    if (searchResultIds.length === 0) return;
    const prevIdx = (currentSearchIndex - 1 + searchResultIds.length) % searchResultIds.length;
    setCurrentSearchIndex(prevIdx);
    scrollToMessage(searchResultIds[prevIdx]);
  };

  const loadMoreMessages = async () => {
    if (isLoadingMore || !hasMore || messages.length === 0) return;
    setIsLoadingMore(true);

    const firstMessageId = messages[0].id;
    try {
      const olderMsgs = await getChatHistory(friend.room_id, 50, firstMessageId);
      if (olderMsgs.length < 50) {
        setHasMore(false);
      }

      const scrollContainer = document.getElementById("chat-scroll-container");
      const oldScrollHeight = scrollContainer?.scrollHeight || 0;

      setMessages((prev) => [...olderMsgs, ...prev]);

      // restore scroll position after React mounts the older messages
      setTimeout(() => {
        if (scrollContainer) {
          const newScrollHeight = scrollContainer.scrollHeight;
          scrollContainer.scrollTop = newScrollHeight - oldScrollHeight;
        }
      }, 0);
    } catch (e) {
      console.error("Failed to load more messages", e);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    const scrollContainer = document.getElementById("chat-scroll-container");
    const isNearBottom = scrollContainer ? (scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 300) : true;

    if (messages.length > 0 && messages.length <= 50) {
      // First load or small chat
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (isNearBottom) {
      // Only auto-scroll to bottom if we are actively at the bottom
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const unseenIds = messages
        .filter(m => m.type !== "system" && m.sender && m.sender.toLowerCase() !== myUsername?.toLowerCase() && m.status !== "seen")
        .map(m => m.id);

      if (unseenIds.length > 0) {
        wsRef.current.send(JSON.stringify({ type: "mark_seen", msg_ids: unseenIds }));
        setMessages(prev => prev.map(m => unseenIds.includes(m.id) ? { ...m, status: "seen" } : m));
      }
    }
  }, [messages, myUsername]);

  function sendMessage() {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    const trimmed = text.trim();
    if (!trimmed) return;

    const payload = { text: trimmed };
    if (replyingTo) {
      payload.reply_to_id = replyingTo.id;
    }

    ws.send(JSON.stringify(payload));
    setText("");
    setShowEmojiPicker(false);
    setReplyingTo(null);

    // Clear our own typing status instantly
    ws.send(JSON.stringify({ type: "stop_typing" }));
    if (myTypingTimeoutRef.current) clearTimeout(myTypingTimeoutRef.current);
    lastTypedTimeRef.current = 0;
  }

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { uploadFile } = await import("../../api/chatApi");
      const res = await uploadFile(file);

      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;

      const fileUrl = res.url;
      const fileType = res.type;

      let msgText = "";
      if (fileType.startsWith("image/")) {
        msgText = `[IMAGE:${fileUrl}]`;
      } else if (fileType.startsWith("video/")) {
        msgText = `[VIDEO:${fileUrl}]`;
      } else {
        msgText = `[FILE:${fileUrl}]`;
      }

      ws.send(JSON.stringify({ text: msgText }));
    } catch (err) {
      console.error("File upload failed", err);
      alert("Failed to upload file");
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);

    // Throttled typing indicator (max 1 per second to avoid flooding)
    const now = Date.now();
    if (now - lastTypedTimeRef.current > 1000) {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "typing" }));
        lastTypedTimeRef.current = now;
      }
    }

    // Debounce stop typing (trigger 2 seconds after last keystroke)
    if (myTypingTimeoutRef.current) clearTimeout(myTypingTimeoutRef.current);
    myTypingTimeoutRef.current = setTimeout(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "stop_typing" }));
      }
    }, 2000);
  };

  const startRecording = async (type) => { // 'audio' or 'video'
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === 'video'
      });
      mediaStreamRef.current = stream;

      if (type === 'video' && previewVideoRef.current) {
        previewVideoRef.current.srcObject = stream;
      }

      const recorder = new RecordRTC(stream, {
        type: type,
        mimeType: type === 'video' ? 'video/webm' : 'audio/webm',
      });

      recorder.startRecording();
      rtcRecorderRef.current = recorder;

      if (type === 'audio') setIsRecordingAudio(true);
      if (type === 'video') setIsRecordingVideo(true);

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Failed to start recording", err);
      alert(`Could not access ${type === 'video' ? 'camera and microphone' : 'microphone'}`);
    }
  };

  const stopAndSendRecording = () => {
    if (!rtcRecorderRef.current) return;

    // Determine type before cleanup
    const type = isRecordingVideo ? 'video' : 'audio';

    rtcRecorderRef.current.stopRecording(async () => {
      const blob = rtcRecorderRef.current.getBlob();
      // Generate a file name with proper extension
      const file = new File([blob], `recording-${Date.now()}.${type === 'video' ? 'webm' : 'webm'}`, { type: blob.type });

      stopRecordingCleanup();
      setIsRecordingAudio(false);
      setIsRecordingVideo(false);

      // Upload and send
      try {
        const { uploadFile } = await import("../../api/chatApi");
        const res = await uploadFile(file);

        const ws = wsRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) return;

        const fileUrl = res.url;
        let msgText = type === 'video' ? `[VIDEO:${fileUrl}]` : `[AUDIO:${fileUrl}]`;
        ws.send(JSON.stringify({ text: msgText }));
      } catch (err) {
        console.error("File upload failed", err);
        alert("Failed to send recording");
      }
    });
  };

  const cancelRecording = () => {
    stopRecordingCleanup();
    setIsRecordingAudio(false);
    setIsRecordingVideo(false);
  };

  const formatRecordingTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  function handleDeleteForMe() {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && deleteMessageIds.length > 0) {
      deleteMessageIds.forEach(id => {
        wsRef.current.send(JSON.stringify({ type: "delete_message_for_me", msg_id: id }));
      });
    }
    setMessages((prev) => prev.filter(m => !deleteMessageIds.includes(m.id)));
    setDeleteMessageIds([]);
    setSelectionMode(false);
    setSelectedMessageIds(new Set());
  }

  function handleDeleteForEveryone() {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && deleteMessageIds.length > 0) {
      if (deleteMessageIds.length === 1) {
        wsRef.current.send(JSON.stringify({ type: "delete_message_for_everyone", msg_id: deleteMessageIds[0] }));
      } else {
        wsRef.current.send(JSON.stringify({ type: "delete_messages_for_everyone", msg_ids: deleteMessageIds }));
      }
    }
    setDeleteMessageIds([]);
    setSelectionMode(false);
    setSelectedMessageIds(new Set());
  }

  const handleCopy = (e, msgId, text) => {
    e.stopPropagation();

    // Modern approach
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text);
    } else {
      // Fallback for non-HTTPS local usage
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "absolute";
      textArea.style.opacity = "0";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
      } catch (err) {
        console.error("Fallback: Oops, unable to copy", err);
      }
      textArea.remove();
    }

    if (msgId) {
      // Visual feedback
      setCopiedMessageId(msgId);
      setTimeout(() => {
        setCopiedMessageId(null);
        setActiveDropdownId(null);
      }, 1500);
    }
  };

  const handleBulkCopy = () => {
    // Collect texts of all selected messages
    const selectedMsgs = messages.filter(m => selectedMessageIds.has(m.id));
    const combinedText = selectedMsgs.map(m => m.text).join("\n");

    handleCopy({ stopPropagation: () => { } }, null, combinedText);

    // Provide visual toast feedback and reset
    setSelectionMode(false);
    setSelectedMessageIds(new Set());
  };

  const scrollToMessage = (msgId) => {
    const el = document.getElementById(`msg-${msgId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedMessageId(msgId);
      setTimeout(() => setHighlightedMessageId(null), 2000);
    }
  };

  return (
    <div className="h-full flex flex-col relative bg-transparent">
      {/* Delete Modal Popup */}
      {deleteMessageIds.length > 0 && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${theme === 'dark' ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-white text-slate-900 border border-slate-200'}`}>
            <h3 className="text-lg font-bold tracking-tight text-center mb-6">
              Delete {deleteMessageIds.length} {deleteMessageIds.length === 1 ? 'Message' : 'Messages'}?
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDeleteForMe}
                className="w-full rounded-xl py-3 font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 transition-colors"
              >
                Delete for me
              </button>
              <button
                onClick={handleDeleteForEveryone}
                className="w-full rounded-xl py-3 font-semibold bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-500 dark:hover:bg-red-500/20 transition-colors"
              >
                Delete for everyone
              </button>
              <button
                onClick={() => setDeleteMessageIds([])}
                className="w-full rounded-xl py-3 font-semibold shadow-md shadow-slate-200 dark:shadow-none bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      {selectionMode ? (
        <div className={`px-6 py-4 flex items-center justify-between relative z-10 transition-colors shadow-sm ${theme === "dark" ? "bg-slate-900 border-b border-slate-800 text-white" : "bg-white border-b border-slate-200 text-slate-800"}`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setSelectionMode(false); setSelectedMessageIds(new Set()); }}
              className={`p-2 rounded-full transition-colors ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
            >
              <CloseIcon />
            </button>
            <span className="font-extrabold text-lg tracking-wide">{selectedMessageIds.size} Selected</span>
          </div>
          <div className="flex items-center gap-2">
            {selectedMessageIds.size > 0 && (
              <>
                <button
                  onClick={handleBulkCopy}
                  className={`p-2.5 rounded-full transition-colors ${theme === "dark" ? "hover:bg-slate-800 text-emerald-400" : "hover:bg-slate-100 text-emerald-600"}`}
                  title="Copy Selected"
                >
                  <CopyIcon />
                </button>
                <button
                  onClick={() => setDeleteMessageIds(Array.from(selectedMessageIds))}
                  className={`p-2.5 rounded-full transition-colors ${theme === "dark" ? "hover:bg-red-500/20 text-red-500" : "hover:bg-red-50 text-red-600"}`}
                  title="Delete Selected"
                >
                  <TrashIcon />
                </button>
              </>
            )}
          </div>
        </div>
      ) : searchMode ? (
        <div className={`px-6 py-4 flex items-center gap-3 relative z-10 transition-colors shadow-sm ${theme === "dark" ? "bg-slate-900 border-b border-slate-800" : "bg-white border-b border-slate-200"}`}>
          <button
            onClick={() => { setSearchMode(false); setSearchQuery(""); }}
            className={`shrink-0 p-2 rounded-full transition-colors ${theme === "dark" ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"}`}
          >
            <CloseIcon />
          </button>
          <div className="flex-1 relative flex items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <div className={`absolute left-4 ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>
                <SearchIcon />
              </div>
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className={`w-full rounded-xl pl-12 pr-4 py-2 outline-none font-medium transition-colors text-[14px] ${theme === "dark"
                  ? "bg-slate-800 text-white placeholder:text-slate-500 border border-slate-700 focus:border-indigo-500/50"
                  : "bg-slate-50 text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:border-blue-500/50"
                  }`}
              />
            </div>
            {searchQuery && (
              <div className={`flex items-center gap-1 text-[13px] font-bold ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                <span className="min-w-[40px] text-center">
                  {searchResultIds.length > 0 ? currentSearchIndex + 1 : 0} / {searchResultIds.length}
                </span>
                <div className="flex">
                  <button onClick={goToPrevSearchResult} disabled={searchResultIds.length === 0} className={`p-1.5 rounded-md ${theme === 'dark' ? 'hover:bg-slate-800 disabled:opacity-50' : 'hover:bg-slate-100 disabled:opacity-50'}`}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
                    </svg>
                  </button>
                  <button onClick={goToNextSearchResult} disabled={searchResultIds.length === 0} className={`p-1.5 rounded-md ${theme === 'dark' ? 'hover:bg-slate-800 disabled:opacity-50' : 'hover:bg-slate-100 disabled:opacity-50'}`}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={`px-6 py-4 flex items-center gap-4 relative z-10 transition-colors ${theme === "dark" ? "bg-slate-900 border-b border-slate-800" : "bg-white border-b border-slate-200"}`}>
          <div className={`h-11 w-11 shrink-0 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-slate-100 border border-slate-200 text-slate-600'}`}>
            {(friend.username?.[0] || "U").toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className={`font-bold text-lg truncate flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {friend.username}
              <div className={`h-2.5 w-2.5 rounded-full shadow-sm ${friendOnline ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-slate-300'}`}></div>
            </div>
            <div className={`text-xs font-medium truncate mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {friendTyping ? (
                <span className="text-indigo-400 font-semibold animate-pulse tracking-wide">typing...</span>
              ) : (
                friendOnline ? 'Active now' : 'Offline'
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setSearchMode(true)}
              className={`p-2.5 rounded-full transition-colors ${theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
              title="Search Messages"
            >
              <SearchIcon />
            </button>
            <span
              className={`text-[11px] font-bold tracking-wide px-3 py-1.5 rounded-full ${connected
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                }`}
            >
              {statusText}
            </span>
          </div>
        </div>
      )}

      {/* Body */}
      <div
        id="chat-scroll-container"
        className="flex-1 p-6 space-y-4 overflow-y-auto relative z-10 scrollbar-hide"
        onScroll={(e) => {
          const { scrollTop, scrollHeight, clientHeight } = e.target;
          // Show button if we are scrolled up more than 150px from the bottom
          const isScrolledUp = scrollHeight - scrollTop - clientHeight > 150;
          setShowScrollButton(isScrolledUp);

          if (scrollTop === 0) {
            loadMoreMessages();
          }
        }}
      >
        {isLoadingMore && (
          <div className="flex justify-center w-full py-2">
            <div className="w-5 h-5 rounded-full border-2 border-pink-500 border-t-transparent animate-spin"></div>
          </div>
        )}
        {messages.map((m, i) => {
          if (m.type === "system") {
            return (
              <div key={i} className="text-center">
                <span className={`text-[11px] font-bold tracking-wider px-4 py-1.5 rounded-full ${theme === "dark" ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                  {m.text}
                </span>
              </div>
            );
          }

          // Compare the sender username with our current logged-in username
          // (Case insensitive match just to be safe)
          const isMe =
            myUsername &&
            m.sender &&
            m.sender.toLowerCase() === myUsername.toLowerCase();

          let timeStr = "";
          if (m.created_at) {
            const d = new Date(m.created_at);
            timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }

          const isSelected = selectedMessageIds.has(m.id);
          const isSearchMatch = searchMode && searchQuery && m.text?.toLowerCase().includes(searchQuery.toLowerCase());
          const isCurrentSearchMatch = isSearchMatch && searchResultIds[currentSearchIndex] === m.id;

          // Parse for images/videos
          let renderedText = <div className="text-[15px] leading-relaxed font-medium">{m.text}</div>;
          if (m.text && typeof m.text === "string") {
            const imgMatch = m.text.match(/^\[IMAGE:(.+)\]$/);
            const vidMatch = m.text.match(/^\[VIDEO:(.+)\]$/);
            const audMatch = m.text.match(/^\[AUDIO:(.+)\]$/);
            const fileMatch = m.text.match(/^\[FILE:(.+)\]$/);

            if (imgMatch) {
              renderedText = (
                <div className="mt-1 mb-2">
                  <img src={imgMatch[1]} alt="Uploaded" className="max-w-[250px] max-h-[250px] rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 object-contain" />
                </div>
              );
            } else if (vidMatch) {
              renderedText = (
                <div className="mt-1 mb-2">
                  <video src={vidMatch[1]} controls className="max-w-[250px] max-h-[250px] rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 outline-none" />
                </div>
              );
            } else if (audMatch) {
              renderedText = (
                <div className="mt-1 mb-2 w-[220px]">
                  <audio src={audMatch[1]} controls className="w-full h-[40px] rounded-full outline-none" />
                </div>
              );
            } else if (fileMatch) {
              renderedText = (
                <div className="mt-1 mb-1">
                  <a href={fileMatch[1]} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 p-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-indigo-300' : 'bg-slate-100 border-slate-200 text-blue-600'} hover:underline font-semibold text-sm`}>
                    <PaperclipIcon />
                    <span>Download File</span>
                  </a>
                </div>
              );
            }
          }

          return (
            <div key={i} id={`msg-${m.id}`} className={`flex w-full items-center gap-3 px-2 transition-all duration-300 ${highlightedMessageId === m.id || isCurrentSearchMatch ? 'scale-[1.01]' : ''} ${selectionMode && isSelected ? "bg-indigo-500/5 rounded-xl" : ""} ${isMe ? "justify-end" : "justify-start"}`}>
              {selectionMode && (
                <div
                  className={`shrink-0 cursor-pointer flex items-center justify-center transition-colors ${isSelected ? "text-indigo-500" : theme === "dark" ? "text-slate-600" : "text-slate-300"}`}
                  onClick={() => {
                    const newSet = new Set(selectedMessageIds);
                    if (newSet.has(m.id)) newSet.delete(m.id);
                    else newSet.add(m.id);
                    setSelectedMessageIds(newSet);
                  }}
                >
                  {isSelected ? <CheckCircleIcon /> : <CircleIcon />}
                </div>
              )}

              <div
                onDoubleClick={() => !selectionMode && setReplyingTo({ id: m.id, text: m.text, sender: m.sender || myUsername })}
                className={`group relative rounded-2xl p-3.5 w-fit max-w-[80%] shadow-sm transition-all duration-300 ${isMe
                  ? "bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-tr-md shadow-blue-500/10"
                  : theme === "dark"
                    ? "bg-slate-800 text-slate-200 rounded-tl-md border border-slate-700"
                    : "bg-white text-slate-800 rounded-tl-md border border-slate-200 shadow-sm"
                  } ${highlightedMessageId === m.id ? 'ring-2 ring-indigo-500/50 shadow-indigo-500/20 shadow-lg' : ''} ${isCurrentSearchMatch ? 'ring-2 ring-amber-400 shadow-amber-400/20' : ''} ${isSearchMatch && !isCurrentSearchMatch ? 'ring-1 ring-amber-400/50' : ''}`}
                onClick={() => {
                  if (selectionMode) {
                    const newSet = new Set(selectedMessageIds);
                    if (newSet.has(m.id)) newSet.delete(m.id);
                    else newSet.add(m.id);
                    setSelectedMessageIds(newSet);
                  }
                }}
              >
                {/* Replied Message Context */}
                {m.reply_to_text && (
                  <div
                    onClick={() => scrollToMessage(m.reply_to_id)}
                    className={`mb-3 flex flex-col gap-1 rounded-lg p-2.5 text-[13px] border-l-2 cursor-pointer hover:opacity-80 transition-opacity ${isMe
                      ? "bg-white/10 border-white/40 shadow-inner"
                      : theme === "dark" ? "bg-slate-700/50 border-indigo-400" : "bg-slate-100 border-blue-500"
                      }`}>
                    <div className={`font-semibold text-[11px] tracking-wide flex items-center gap-1.5 ${isMe ? "text-white/80" : theme === "dark" ? "text-indigo-400" : "text-blue-600"}`}>
                      <ReplyIcon />
                      {m.reply_to_sender}
                    </div>
                    <div className={`line-clamp-2 leading-snug ${isMe ? "text-white/90" : theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                      {m.reply_to_text}
                    </div>
                  </div>
                )}

                {/* Dropdown Container */}
                <div className={`absolute top-2 right-2 z-20 ${activeDropdownId === m.id ? "z-50" : ""}`}>
                  {/* Dropdown toggle button */}
                  {!selectionMode && (
                    <div
                      className={`cursor-pointer p-1 rounded-full transition-opacity duration-200 
                       ${activeDropdownId === m.id ? "opacity-100 bg-black/20 text-white" : "opacity-0 group-hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activeDropdownId === m.id) {
                          setActiveDropdownId(null);
                        } else {
                          const rect = e.currentTarget.getBoundingClientRect();
                          // Since others' messages are left-aligned, expand right (left-0). Ours expand left (right-0).
                          const alignLeft = !isMe;
                          // If less than 220px to the bottom of the window, we must expand UP (bottom-full)
                          const alignTop = (window.innerHeight - rect.bottom) < 220;

                          setDropdownPos({ alignLeft, alignTop });
                          setActiveDropdownId(m.id);
                        }
                      }}
                    >
                      <ChevronDownIcon />
                    </div>
                  )}

                  {/* Dropdown menu */}
                  {activeDropdownId === m.id && !selectionMode && (
                    <div className={`absolute w-32 rounded-xl shadow-xl overflow-hidden ${dropdownPos.alignTop ? "bottom-full mb-1 origin-bottom" : "top-full mt-1 origin-top"
                      } ${dropdownPos.alignLeft ? "left-0" : "right-0"
                      } ${theme === "dark" ? "bg-slate-800 border border-slate-700 shadow-black/50 text-slate-200" : "bg-white border border-slate-200 shadow-slate-200/50 text-slate-800"}`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectionMode(true);
                          setSelectedMessageIds(new Set([m.id]));
                          setActiveDropdownId(null);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-[13px] font-bold transition-colors ${theme === "dark" ? "hover:bg-slate-700" : "hover:bg-slate-50"}`}
                      >
                        Select
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setReplyingTo({ id: m.id, text: m.text, sender: m.sender || myUsername });
                          setActiveDropdownId(null);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-[13px] font-bold transition-colors ${theme === "dark" ? "hover:bg-slate-700" : "hover:bg-slate-50"}`}
                      >
                        Reply
                      </button>
                      <button
                        onClick={(e) => handleCopy(e, m.id, m.text)}
                        className={`w-full text-left px-4 py-2.5 text-[13px] font-bold transition-colors ${theme === "dark"
                          ? copiedMessageId === m.id ? "bg-emerald-500/10 text-emerald-400" : "hover:bg-slate-700"
                          : copiedMessageId === m.id ? "bg-emerald-50 text-emerald-600" : "hover:bg-slate-50"
                          }`}
                      >
                        {copiedMessageId === m.id ? "Copied! ✓" : "Copy"}
                      </button>
                      {isMe && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteMessageIds([m.id]);
                            setActiveDropdownId(null);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-[13px] font-bold text-red-500 transition-colors ${theme === "dark" ? "hover:bg-slate-700" : "hover:bg-slate-50"
                            }`}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {!isMe && (
                  <div className={`text-xs font-bold tracking-wide mb-1.5 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>{m.sender}</div>
                )}
                {renderedText}
                {timeStr && (
                  <div className={`text-[10px] mt-2 font-bold tracking-wider ${isMe ? "text-white/70" : theme === "dark" ? "text-slate-500" : "text-slate-400"} flex items-center justify-end gap-1.5`}>
                    <span>{timeStr}</span>
                    {isMe && (
                      <span className={m.status === "seen" ? "text-sky-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)] scale-[1.15] transition-all" : m.status === "delivered" ? "text-white/90" : "text-white/50"}>
                        {m.status === "seen" || m.status === "delivered" ? <DoubleCheckIcon /> : <CheckIcon />}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {friendTyping && (
          <div className="flex w-full justify-start mt-2">
            <div className={`flex gap-1.5 items-center px-4 py-3 pb-3 rounded-2xl ${theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200 shadow-sm'}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Floating Scroll to Bottom Button */}
      {showScrollButton && (
        <div className="absolute right-6 bottom-[6rem] z-30 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <button
            onClick={() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className={`flex items-center justify-center p-3 rounded-full shadow-xl transition-all hover:scale-110 active:scale-95 ${theme === 'dark' ? 'bg-slate-700 text-white hover:bg-slate-600 shadow-black/50' : 'bg-white text-slate-800 hover:bg-slate-50 shadow-slate-300'}`}
            title="Scroll to bottom"
          >
            <ArrowDownIcon />
          </button>
        </div>
      )}

      {/* Input Section Container */}
      <div className={`flex flex-col relative z-20 transition-colors ${theme === "dark" ? "bg-slate-900 border-t border-slate-800" : "bg-white border-t border-slate-200"}`}>

        {/* Reply Preview Box */}
        {replyingTo && (
          <div className={`px-6 py-3 flex items-center justify-between border-b animate-in slide-in-from-bottom-2 fade-in duration-300 ${theme === "dark" ? "border-slate-800 bg-slate-800/50" : "border-slate-100 bg-slate-50"}`}>
            <div className={`flex-1 min-w-0 pr-4 border-l-2 pl-3 ${theme === "dark" ? "border-indigo-500" : "border-blue-500"}`}>
              <div className={`text-[11px] font-semibold mb-0.5 tracking-wide flex items-center gap-1.5 ${theme === "dark" ? "text-indigo-400" : "text-blue-600"}`}>
                <ReplyIcon /> Replying to {replyingTo.sender}
              </div>
              <div className={`text-sm truncate ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                {replyingTo.text}
              </div>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className={`p-1.5 rounded-full transition-colors ${theme === "dark" ? "text-slate-400 hover:text-white hover:bg-slate-700" : "text-slate-400 hover:text-slate-800 hover:bg-slate-200"}`}
            >
              <CloseIcon />
            </button>
          </div>
        )}

        <div className="p-4 flex gap-3 items-center">
          {/* Recording UI overlay when active */}
          {(isRecordingAudio || isRecordingVideo) && (
            <div className="absolute inset-x-0 bottom-0 h-full flex items-center justify-between px-6 z-50 animate-in slide-in-from-bottom flex-1 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-b-[2rem]">
              <div className="flex items-center gap-4 text-red-500 font-bold animate-pulse">
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                Recording {isRecordingVideo ? 'Video' : 'Audio'}... {formatRecordingTime(recordingTime)}
              </div>

              {isRecordingVideo && (
                <div className="absolute bottom-16 right-6 w-32 h-40 bg-black rounded-xl overflow-hidden shadow-2xl border-2 border-indigo-500 z-50">
                  {/* eslint-disable-next-line */}
                  <video ref={previewVideoRef} muted autoPlay className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={cancelRecording}
                  className="px-4 py-2 font-semibold text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={stopAndSendRecording}
                  className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all active:scale-95"
                  title="Send Recording"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {showEmojiPicker && !isRecordingAudio && !isRecordingVideo && (
            <div className="absolute bottom-[calc(100%+10px)] left-4 z-50 shadow-2xl rounded-xl">
              <EmojiPicker
                theme={theme === "dark" ? "dark" : "light"}
                onEmojiClick={(emojiData) => setText(prev => prev + emojiData.emoji)}
              />
            </div>
          )}
          <button
            onClick={() => setShowEmojiPicker(prev => !prev)}
            disabled={!connected}
            className={`shrink-0 p-2 flex items-center justify-center rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${theme === "dark"
              ? "text-slate-400 hover:text-pink-400 hover:bg-slate-800"
              : "text-slate-500 hover:text-pink-600 hover:bg-slate-100"
              } ${showEmojiPicker ? (theme === "dark" ? "text-pink-400 bg-slate-800" : "text-pink-600 bg-slate-100") : ""}`}
            title="Emoji"
          >
            <SmileIcon />
          </button>

          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => handleFileUpload(e, 'image')} />
          <input type="file" accept="video/*" className="hidden" ref={videoInputRef} onChange={(e) => handleFileUpload(e, 'video')} />
          <input type="file" accept="*" className="hidden" ref={documentInputRef} onChange={(e) => handleFileUpload(e, 'document')} />

          <div className="relative flex items-center shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); setShowAttachmentMenu(prev => !prev); }}
              disabled={!connected}
              className={`p-2 flex items-center justify-center rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${theme === "dark"
                ? "text-slate-400 hover:text-indigo-400 hover:bg-slate-800"
                : "text-slate-500 hover:text-blue-600 hover:bg-slate-100"
                } ${showAttachmentMenu ? (theme === "dark" ? "text-indigo-400 bg-slate-800" : "text-blue-600 bg-slate-100") : ""}`}
              title="Attach File"
            >
              <PaperclipIcon />
            </button>

            {showAttachmentMenu && (
              <div
                className={`absolute bottom-[calc(100%+10px)] left-0 z-50 w-48 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 ${theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col p-2 space-y-1">
                  <button
                    onClick={() => { fileInputRef.current?.click(); setShowAttachmentMenu(false); }}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[14px] font-semibold transition-colors ${theme === 'dark' ? 'hover:bg-slate-700 text-slate-200 hover:text-indigo-400' : 'hover:bg-slate-100 text-slate-700 hover:text-blue-600'}`}
                  >
                    <ImageIcon /> Photo
                  </button>
                  <button
                    onClick={() => { videoInputRef.current?.click(); setShowAttachmentMenu(false); }}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[14px] font-semibold transition-colors ${theme === 'dark' ? 'hover:bg-slate-700 text-slate-200 hover:text-indigo-400' : 'hover:bg-slate-100 text-slate-700 hover:text-blue-600'}`}
                  >
                    <VideoIcon /> Video
                  </button>
                  <button
                    onClick={() => { documentInputRef.current?.click(); setShowAttachmentMenu(false); }}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[14px] font-semibold transition-colors ${theme === 'dark' ? 'hover:bg-slate-700 text-slate-200 hover:text-indigo-400' : 'hover:bg-slate-100 text-slate-700 hover:text-blue-600'}`}
                  >
                    <DocumentIcon /> Document
                  </button>
                </div>
              </div>
            )}
          </div>

          <input
            value={text}
            onChange={handleTextChange}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            disabled={!connected}
            className={`flex-1 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 transition-all text-[15px] ${theme === "dark"
              ? "bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:bg-slate-800/80"
              : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white"
              }`}
          />
          <button
            onClick={sendMessage}
            disabled={!connected}
            className="w-12 h-12 rounded-full font-semibold text-white shadow-md shadow-blue-500/10
            bg-gradient-to-br from-indigo-600 to-blue-600 shrink-0
            hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            title="Send Message"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="-ml-1">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>

          <button
            onClick={() => startRecording('audio')}
            disabled={!connected || isRecordingAudio || isRecordingVideo}
            className={`shrink-0 p-3 h-12 w-12 flex items-center justify-center rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${theme === "dark"
              ? "text-slate-200 bg-red-500/20 hover:bg-red-500/40 text-red-400"
              : "text-red-500 bg-red-50 hover:bg-red-100"
              }`}
            title="Record Voice"
          >
            <MicrophoneIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
