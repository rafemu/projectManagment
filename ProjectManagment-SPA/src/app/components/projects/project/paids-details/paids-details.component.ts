import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BaseURL } from 'src/app/_services';
import { ImageViewComponent } from '../../image-view/image-view.component';
import { AddPaidsComponent } from './add-paids/add-paids.component';

@Component({
  selector: 'app-paids-details',
  templateUrl: './paids-details.component.html',
  styleUrls: ['./paids-details.component.scss']
})
export class PaidsDetailsComponent implements OnInit {
  @Output() AddPaidsEvent = new EventEmitter<any>();
  @Output() UpdatePaidsEvent = new EventEmitter<any>();
  @Output() DeletePaidsEvent = new EventEmitter<any>();
  @Input() projectPiads!:any;
  public  imgPath = BaseURL;
  public dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
  Object.create(null);
@ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);
displayedColumns = [
  'id',
  'date',
  'paid',
  'notes',
  'checkImg',
  'action'
];
  constructor(  public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog(action: string, obj: any) {
    obj.action = action;
    console.log(action)
    const dialogRef = this.dialog.open(AddPaidsComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result)
      if (typeof result === 'undefined') return;
      if (result.event === 'Add') {
        this.AddPaidsEvent.emit(result.data)
      } else if (result.event === 'Update') {
        this.UpdatePaidsEvent.emit({data:result.data,id:obj.id})
      } else if (result.event === 'Delete') {
        this.DeletePaidsEvent.emit(obj.id)
      }
    });
  }

  openAgreement(obj: any) {
    const dialogRef = this.dialog.open(ImageViewComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  
  ngOnChanges(): void {
    this.dataSource = new MatTableDataSource<any>(this.projectPiads?.paids);
    console.log(this.projectPiads)

  }
}
