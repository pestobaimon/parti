import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserCreationPage } from './user-creation.page';

describe('UserCreationPage', () => {
  let component: UserCreationPage;
  let fixture: ComponentFixture<UserCreationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCreationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserCreationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
