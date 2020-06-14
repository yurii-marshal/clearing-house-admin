import { PageHeaderModule } from './loader-screen.module';

describe('LoaderScreenModule', () => {
  let pageHeaderModule: PageHeaderModule;

  beforeEach(() => {
    pageHeaderModule = new PageHeaderModule();
  });

  it('should create an instance', () => {
    expect(pageHeaderModule).toBeTruthy();
  });
});
