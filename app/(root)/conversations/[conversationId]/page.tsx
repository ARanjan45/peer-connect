import ConversationClient from "./ConversationClient";

interface PageProps {
  params: {
    conversationId: string;
  };
}

export default function ConversationPage({ params }: PageProps) {
  return <ConversationClient conversationId={params.conversationId} />;
}