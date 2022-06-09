import { Component, OnInit } from '@angular/core';
import { TodoDisplayComponent } from '../todo-display/todo-display.component';
import { Ticket } from '../ticket';
import { TicketService } from '../ticket.service';

@Component({
  selector: 'app-ticket-view',
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.css'],
  providers:[TodoDisplayComponent]
  
})
export class TicketViewComponent implements OnInit {
ticketID: number = 0;
userID: string = "";
focusTicket = new Ticket (0,"","","","",true,"");
currentUser: string = this.Todo.currentUser;
resolution: string ="";
  constructor(private ticketService: TicketService, private Todo: TodoDisplayComponent) {
    
    this.ticketService.searchTicketById(this.getId()).subscribe((response) => {
      this.focusTicket = response;
      
    });
   }

  ngOnInit(): void {
  }

searchTicketsByID(): void {
    this.ticketService.searchTicketById(this.getId()).subscribe((response) => {
      this.focusTicket = response;
      
    });
  }
  swapTicketOpenStatus(id: number, ticket: Ticket, openStatus: boolean): void {
    ticket.isOpen = openStatus;
    
    if (openStatus === false) {
      ticket.resolvedUserId = this.currentUser;
    }
    else {
      ticket.resolvedUserId = "";
    }
    
    this.ticketService.updateTicket(id, ticket).subscribe();
  }

  login(): void {
    this.userID = this.userID.toLowerCase();
    this.Todo.currentUser = this.userID[0].toUpperCase() + this.userID.slice(1);
    this.currentUser = this.Todo.currentUser;
    this.userID = "";
  }

  logout(): void {
    this.Todo.currentUser = "";
    this.currentUser = this.ticketService.currentUser;
  }

  getId(): number {
    var pathArray = window.location.pathname.split('/');
    this.ticketID = parseInt(pathArray[2]);
    console.log(this.ticketService.currentUser);
    console.log(this.currentUser);
    return this.ticketID;


  }
  updateResolution(id: number, ticket: Ticket){
    ticket.resolution =this.resolution;
    ticket.resolvedUserId =this.Todo.currentUser;
    ticket.isOpen=false;
    this.ticketService.updateTicket(id, ticket).subscribe();
  }
}