package services

import (
	"context"
	"os"
	"strings"

	openai "github.com/sashabaranov/go-openai"
)

func GenerateRequirementsWithAI(description string, existing []string) ([]string, error) {
	client := openai.NewClient(os.Getenv("OPENAI_API_KEY"))

	prompt := `Given the following project description, generate 3-5 clear and specific requirements.
Each requirement should be actionable and testable.

Project Description:
${description}

${existingContext}

Format each requirement on a new line starting with '- '.`

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT3Dot5Turbo,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: "You are a skilled project manager and requirements analyst.",
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: strings.Replace(prompt, "${description}", description, -1),
				},
			},
		},
	)

	if err != nil {
		return nil, err
	}

	// Parse the response into individual requirements
	content := resp.Choices[0].Message.Content
	requirements := parseRequirements(content)

	return requirements, nil
}

func parseRequirements(content string) []string {
	lines := strings.Split(content, "\n")
	var requirements []string

	for _, line := range lines {
		line = strings.TrimSpace(line)
		if strings.HasPrefix(line, "- ") {
			requirement := strings.TrimPrefix(line, "- ")
			requirements = append(requirements, requirement)
		}
	}

	return requirements
}
