import { Admin } from "../admin/admin.interface"
import { Channel } from "../channel/channel.interface"

interface ChannelAdmin {
    adminId: number;
    channelId: number;
    Admin: Admin;
    Channel: Channel;
}