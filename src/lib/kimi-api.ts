const API_KEY = 'sk-fdEQlO37MFEJyN2jGZK28YWIHr0BSSNBvMBdjxOOORqzWJao';
const API_URL = 'https://api.moonshot.cn/v1/chat/completions';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface KimiResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function callKimiAPI(messages: ChatMessage[], temperature: number = 0.6): Promise<string> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'kimi-k2-turbo-preview',
        messages: messages,
        temperature: temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`API调用失败: ${response.status}`);
    }

    const data: KimiResponse = await response.json();
    return data.choices[0]?.message?.content || '抱歉，暂时无法生成内容';
  } catch (error) {
    console.error('Kimi API调用错误:', error);
    return '抱歉，暂时无法生成内容';
  }
}

// 美食段子生成
export async function generateFoodJoke(): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: '你是一个幽默的美食段子生成器，专门生成搞笑的美食相关文案。文案要简短有趣，贴近生活，让人会心一笑。'
    },
    {
      role: 'user',
      content: '生成一句搞笑的美食段子，比如关于饿了的感受或者想吃什么的状态'
    }
  ];
  
  return await callKimiAPI(messages, 0.8);
}

// 美食冷知识生成
export async function generateFoodFact(): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: '你是一个美食冷知识专家，专门提供有趣、奇葩的美食知识。知识要准确但有趣，让人意想不到。'
    },
    {
      role: 'user',
      content: '生成一个有趣的美食冷知识，要让人意想不到'
    }
  ];
  
  return await callKimiAPI(messages, 0.7);
}

// 随机菜品推荐
export async function generateRandomFood(): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: '你是一个创意菜品推荐师，推荐各种有趣的美食。可以是真实菜品，也可以是创意组合。'
    },
    {
      role: 'user',
      content: '随机推荐一个菜品，可以是真实的也可以是创意的组合'
    }
  ];
  
  return await callKimiAPI(messages, 0.9);
}

// 虚构菜单生成
export async function generateFictionalMenu(): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: '你是一个创意菜单设计师，专门设计虚构的、有创意的菜单。菜单名称要有想象力，听起来很有趣或者很奇特。'
    },
    {
      role: 'user',
      content: '生成一个虚构的菜单名称，要有创意和想象力'
    }
  ];
  
  return await callKimiAPI(messages, 0.9);
}

// 彩蛋文字生成
export async function generateEasterEgg(): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: '你是一个有趣的彩蛋文字生成器，专门生成让人惊喜的小彩蛋文字。文字要简短有趣，给人惊喜感。'
    },
    {
      role: 'user',
      content: '生成一句有趣的彩蛋文字，比如获得什么称号或者有什么惊喜'
    }
  ];
  
  return await callKimiAPI(messages, 0.8);
}