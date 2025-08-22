using Microsoft.Extensions.AI;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OpenCvSharp;
using System.Text.Json.Serialization;

var builder = Host.CreateApplicationBuilder();

builder.Services.AddChatClient(new OpenAI.Chat.ChatClient(
    "gpt-4.1",
    builder.Configuration["OpenAI:ApiKey"]).AsIChatClient());

var app = builder.Build();

var chatClient = app.Services.GetRequiredService<IChatClient>();

var videoPath = "videos/cctv.mp4";
using var capture = new VideoCapture(videoPath);
using var frame = new Mat();

int frameRate = (int)capture.Fps;
int frameNumber = 0;

while (true)
{
    if (!capture.Read(frame) || frame.Empty())
    {
        break;
    }

    if (frameNumber % frameRate == 0)
    {
        Directory.CreateDirectory("frames");
        var filename = Path.Combine(Directory.GetCurrentDirectory(), $"frames\\frame_{frameNumber:D3}.png");
        Cv2.ImWrite(filename, frame);
    }

    frameNumber++;
}

// #1 - Simple example
//foreach (var filePath in Directory.GetFiles("frames", "*.png"))
//{
//    var message = new ChatMessage(ChatRole.User,
//        """
//        Extract information from this image from a camera.
//        The image from the camera may be blurry, so take that into account when extracting information.
//        Pay extra attention to living objects appearing in the video and try to accurately describe them.
//        """);
//    message.Contents.Add(new DataContent(File.ReadAllBytes(filePath), "image/png"));

//    var camResult = await chatClient.GetResponseAsync(message);

//    Console.WriteLine(camResult.Messages.First().Text);
//    Console.WriteLine();
//}

// #2 - Enhanced prompt
//foreach (var filePath in Directory.GetFiles("frames", "*.png"))
//{
//    var enhancedMessage = new ChatMessage(ChatRole.User,
//        """
//        You are a security monitoring AI analyzing CCTV footage from a backyard camera.
//        Your task is to detect any living beings or movement that could indicate a security concern.

//        ANALYSIS REQUIREMENTS:
//        1. DETECT LIVING BEINGS: Look for humans, animals, birds, or any living creatures
//        2. MOVEMENT DETECTION: Identify any motion, shadows, or changes that suggest activity
//        3. SECURITY ASSESSMENT: Determine if any detected activity poses a security risk
//        4. CONFIDENCE SCORING: Rate your confidence from 1-10 (1=very uncertain, 10=completely certain)
//        5. IMAGE QUALITY: Consider blur, lighting, and camera angle limitations

//        RESPONSE FORMAT:
//        - ALERT STATUS: [NONE/LOW/MEDIUM/HIGH] based on security risk
//        - DETECTED OBJECTS: List any living beings or suspicious movement
//        - CONFIDENCE: [1-10] rating of your analysis certainty
//        - DESCRIPTION: Detailed description of what you observe
//        - RECOMMENDATION: Any security actions needed
//        - SPECIAL RULES: We're afraid of cats. So they pose a high risk.

//        Analyze this CCTV frame carefully and provide a structured response.
//        """);
//    enhancedMessage.Contents.Add(new DataContent(File.ReadAllBytes(filePath), "image/png"));

//    var enhancedResult = await chatClient.GetResponseAsync(enhancedMessage);
//    var responseText = enhancedResult.Messages.First().Text;

//    var fileName = Path.GetFileName(filePath);
//    // Check if movement is detected and log the filename
//    if (responseText.Contains("**CONFIDENCE:** 9") ||
//        responseText.Contains("**CONFIDENCE:** 10") &&
//        !responseText.Contains("ALERT STATUS: NONE"))
//    {
//        Console.WriteLine($"🚨 MOVEMENT DETECTED in {fileName}");
//        Console.WriteLine(responseText);
//        Console.WriteLine();
//    }
//    else
//    {
//        Console.WriteLine($"All clear in {fileName}");
//    }
//}

// #3 - Strongly-typed response
foreach (var filePath in Directory.GetFiles("frames", "*.png"))
{
    var typedMessage = new ChatMessage(ChatRole.User,
        """
        You are a security monitoring AI analyzing CCTV footage.
        Analyze this image and return a JSON response with the following structure:

        {
            "alertLevel": "None|Low|Medium|High",
            "detectedObjects": ["list", "of", "living", "beings"],
            "confidenceScore": 1-10,
            "description": "Detailed description of what you observe",
            "securityRisk": "None|Low|Medium|High",
            "recommendation": "Any security actions needed"
        }

        Focus on detecting any living beings, movement, or security concerns.
        Consider image quality limitations.
        - SPECIAL RULES: We're afraid of cats. So they pose a high risk.
        """);
    typedMessage.Contents.Add(new DataContent(File.ReadAllBytes(filePath), "image/png"));

    try
    {
        var typedResult = await chatClient.GetResponseAsync<SecurityAnalysisResult>(typedMessage);

        // Log filename if movement is detected
        var result = typedResult.Result;
        var fileName = Path.GetFileName(filePath);
        if (result.AlertLevel > AlertLevel.Low)
        {
            Console.WriteLine($"🚨 SECURITY ALERT in {fileName}");
            Console.WriteLine($"Alert Level: {result.AlertLevel}");
            Console.WriteLine($"Confidence: {result.ConfidenceScore}/10");
            Console.WriteLine($"Detected: {string.Join(", ", result.DetectedObjects)}");
            Console.WriteLine($"Risk: {result.SecurityRisk}");
            Console.WriteLine($"Description: {result.Description}");
            Console.WriteLine($"Recommendation: {result.Recommendation}");
        }
        else
        {
            Console.WriteLine($"All clear in {fileName}");
        }
        Console.WriteLine();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error parsing response for {Path.GetFileName(filePath)}: {ex.Message}");
    }
}


// Strongly typed result for security analysis
public record SecurityAnalysisResult
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public AlertLevel AlertLevel { get; set; }

    public List<string> DetectedObjects { get; set; } = new();

    public int ConfidenceScore { get; set; }

    public string Description { get; set; } = string.Empty;

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public SecurityRisk SecurityRisk { get; set; }

    public string Recommendation { get; set; } = string.Empty;
}

public enum AlertLevel
{
    None,
    Low,
    Medium,
    High
}

public enum SecurityRisk
{
    None,
    Low,
    Medium,
    High
}
