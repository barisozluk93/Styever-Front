import { Component } from '@angular/core';

@Component({
  selector: 'app-kvkk',
  templateUrl: './kvkk.component.html',
  styleUrls: ['./kvkk.component.scss'],
})
export class KvkkComponent {
  kvkkItems = [
    {
      title: 'KVKK.SECTIONS.DATA_CONTROLLER.TITLE',
      text: 'KVKK.SECTIONS.DATA_CONTROLLER.TEXT',
    },
    {
      title: 'KVKK.SECTIONS.PROCESSING_PURPOSES.TITLE',
      text: 'KVKK.SECTIONS.PROCESSING_PURPOSES.TEXT',
    },
    {
      title: 'KVKK.SECTIONS.DATA_STORAGE.TITLE',
      text: 'KVKK.SECTIONS.DATA_STORAGE.TEXT',
    },
    {
      title: 'KVKK.SECTIONS.DATA_TRANSFER.TITLE',
      text: 'KVKK.SECTIONS.DATA_TRANSFER.TEXT',
    },
    {
      title: 'KVKK.SECTIONS.RIGHTS.TITLE',
      text: 'KVKK.SECTIONS.RIGHTS.TEXT',
    },
  ];
}