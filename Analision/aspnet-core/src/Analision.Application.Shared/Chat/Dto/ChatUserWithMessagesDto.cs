using System.Collections.Generic;

namespace Analision.Chat.Dto;

public class ChatUserWithMessagesDto : ChatUserDto
{
    public List<ChatMessageDto> Messages { get; set; }
}

