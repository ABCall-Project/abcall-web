import { TestBed } from '@angular/core/testing';
import { CoreService } from './core.service';
import { AppSettings, defaults } from '../app.config';

describe('CoreService', () => {
  let service: CoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreService],
    });

    service = TestBed.inject(CoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('notify$', () => {
    it('should emit updates when setOptions is called', (done) => {
      const newOptions: AppSettings = { ...defaults, language: 'es' };
      service.notify.subscribe((options) => {
        if (Object.keys(options).length > 0) {
          expect(options).toEqual(newOptions);
          done();
        }
      });

      service.setOptions(newOptions);
    });

    it('should emit updates when setLanguage is called', (done) => {
      const newLanguage = 'fr';
      service.notify.subscribe((options) => {
        if (options['lang']) {
          expect(options['lang']).toBe(newLanguage);
          done();
        }
      });

      service.setLanguage(newLanguage);
    });
  });

  describe('getOptions', () => {
    it('should return the current options', () => {
      const options = service.getOptions();
      expect(options).toEqual(defaults);
    });

    it('should return updated options after setOptions is called', () => {
      const newOptions: AppSettings = { ...defaults, language: 'it' };
      service.setOptions(newOptions);

      const updatedOptions = service.getOptions();
      expect(updatedOptions).toEqual(newOptions);
    });
  });

  describe('setOptions', () => {
    it('should update the options and notify subscribers', (done) => {
      const newOptions: AppSettings = { ...defaults, theme: 'dark' };
      service.notify.subscribe((options) => {
        if (options['theme']) {
          expect(options['theme']).toBe('dark');
          done();
        }
      });

      service.setOptions(newOptions);
      const updatedOptions = service.getOptions();
      expect(updatedOptions.theme).toBe('dark');
    });
  });

  describe('getLanguage', () => {
    it('should return the current language', () => {
      const language = service.getLanguage();
      expect(language).toBe(defaults.language);
    });

    it('should return updated language after setLanguage is called', () => {
      const newLanguage = 'de';
      service.setLanguage(newLanguage);

      const updatedLanguage = service.getLanguage();
      expect(updatedLanguage).toBe(newLanguage);
    });
  });

  describe('setLanguage', () => {
    it('should update the language and notify subscribers', (done) => {
      const newLanguage = 'pt';
      service.notify.subscribe((options) => {
        if (options['lang']) {
          expect(options['lang']).toBe(newLanguage);
          done();
        }
      });

      service.setLanguage(newLanguage);
      const updatedLanguage = service.getLanguage();
      expect(updatedLanguage).toBe(newLanguage);
    });
  });
});
