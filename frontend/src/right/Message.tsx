interface MessageProps {
  end: boolean;
  value: string;
}

export default function Message({ end, value }: MessageProps) {
  return end ? (
    <div className="chat chat-end">
      <div className="chat-bubble chat-bubble-info">{value}</div>
    </div>
  ) : (
    <div className="chat chat-start">
      <div className="chat-bubble chat-bubble-accent">{value}</div>
    </div>
  );
}
