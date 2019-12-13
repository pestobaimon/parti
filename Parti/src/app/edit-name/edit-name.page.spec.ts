import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditNamePage } from './edit-name.page';

describe('EditNamePage', () => {
  let component: EditNamePage;
  let fixture: ComponentFixture<EditNamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditNamePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditNamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
