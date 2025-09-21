import {
  ToastSeverity,
  ToastSeverityIcons,
  ToastSeveritySummary,
} from '../../models';
import { getToastContentBySeverity } from './custom-toast.helpers';

describe('custom-toast helpers tests', () => {
  describe('getToastContentBySeverity function', () => {
    test('it should return success severity option', () => {
      // Arrange
      const severity = ToastSeverity.Success;

      // Act
      const result = getToastContentBySeverity(severity);

      // Assert
      expect(result).toEqual({
        severity,
        summary: ToastSeveritySummary.Success,
        icon: ToastSeverityIcons.CheckCircle,
      });
    });
  });
});
