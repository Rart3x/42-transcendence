import { Channel } from "../channel/channel.interface"

export interface Message {
    messageId: number;
    channelId?: number | null;
    message_text: string;
    message_date?: Date | null;
    Channel?: Channel | null;
}