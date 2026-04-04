// __tests__/services/imageRecognition.test.ts
import { identifyMushroom } from '../src/services/imageRecognition';

describe('蘑菇识别服务', () => {
  it('应返回有效的识别结果', async () => {
    const mockUri = 'file://mock-image.jpg';
    const result = await identifyMushroom(mockUri);
    expect(result).toHaveProperty('mushroomName');
    expect(result).toHaveProperty('confidence');
    expect(typeof result.confidence).toBe('number');
  });
});