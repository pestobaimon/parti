import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PartiDetailPage } from './parti-detail.page';

describe('PartiDetailPage', () => {
  let component: PartiDetailPage;
  let fixture: ComponentFixture<PartiDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartiDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PartiDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
