import { MessageComponent } from './message.component';

describe('MessageComponent', () => {
  let component: MessageComponent;

  beforeEach(async () => {
    component = new MessageComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
