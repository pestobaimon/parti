import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.page.html',
  styleUrls: ['./create-group.page.scss'],
})
export class CreateGroupPage implements OnInit {
  form:FormGroup;
  constructor(
    fb: FormBuilder
  ) {
    let fbargs = {};
    this.allPlayers.forEach(player => fbargs[player.id] = []);
    this.form = fb.group(fbargs);
    this.teamPlayers.forEach(playerid => this.form.get(playerid).setValue(true));
  }
  friends:Array<any> = []
  ngOnInit() {
  }

}
