import { TranslocoConfig, TranslocoService } from '@jsverse/transloco';
import { of, Subject } from 'rxjs';

export const langChangesSubjectMock = new Subject<string>();

export const createTranslationServiceMock = (): Partial<TranslocoService> => ({
  config: {
    reRenderOnLangChange: true,
  } as TranslocoConfig,
  events$: of(),
  getActiveLang: jest.fn().mockReturnValue('en'),
  langChanges$: langChangesSubjectMock.asObservable(),
  load: jest.fn().mockResolvedValueOnce({}),
  selectTranslate: jest.fn().mockReturnValue(of('')),
  setActiveLang: jest.fn(),
  translate: jest.fn(),
});
