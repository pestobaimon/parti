import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FindFriendsPage } from './find-friends.page';

describe('FindFriendsPage', () => {
  let component: FindFriendsPage;
  let fixture: ComponentFixture<FindFriendsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindFriendsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FindFriendsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
