import { Component, OnInit } from '@angular/core';
import { Ticket } from '../ticket';
import { TicketService } from '../ticket.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  currentUser: string = this.ticketService.currentUser;
  userID: string = "";
  allTickets: Ticket[] = [];
  allResolvedUserIdsAndStats: any[][] = [["", -1]];
  openTicketCount: number = 0;
  
  constructor(public ticketService: TicketService) {
    this.showAllTickets();
 }

  showAllTickets(): void {
    this.ticketService.showAllTickets().subscribe((allTickets) => {
      this.allTickets = allTickets;
      this.getResolvedUserIds();
    });
  }

  getResolvedUserIds(): void {
    let emptyArray: any[][] = [["", -1]]; // It's not empty, but ts gets mad if we don't have something.
    this.allResolvedUserIdsAndStats = emptyArray; // We need to empty this array and 0 openTicketCount or it starts over-counting everything.
    this.openTicketCount = 0;

    let alphabetSortInput: any = document.getElementById("alphabetSort");
    let greatestToLeastSortInput: any = document.getElementById("greatestToLeastSort");

    this.allTickets.forEach(ticket => {
      if (ticket.resolvedUserId === '') { // Counts the tickets that are still open.
        this.openTicketCount++;
      }
      else {
        if (this.allResolvedUserIdsAndStats.some(id => id.includes(ticket.resolvedUserId))) { // Increments ticket.resolvedUserId's count.
          let index: number = this.allResolvedUserIdsAndStats.findIndex((stat) => 
            stat[0] === ticket.resolvedUserId
            );

          this.allResolvedUserIdsAndStats[index][1]++;
        }
        else { // When there's a new ticket.resolvedUserId, we add that user to the array and start count at 1.
          this.allResolvedUserIdsAndStats.push([ticket.resolvedUserId, 1]);
        }
      }
    });

    if (alphabetSortInput.checked) {
      this.sortAlphabetical();
    }
    
    if (greatestToLeastSortInput.checked) {
      this.sortGreatestToLeast();
    }
  }

  sortGreatestToLeast(): void {
    this.allResolvedUserIdsAndStats.sort((sort1, sort2) => {
      return sort2[1] - sort1[1]; // for using sort(), we must return a number to know which element comes before which
    });
  }

  sortAlphabetical(): void {
    this.allResolvedUserIdsAndStats.sort((sort1, sort2) => {
      if (sort1[0].toLowerCase() < sort2[0].toLowerCase()) { // we toLowerCase() the user to not let capitalization mess up ordering.
        return -1
      }
      else if (sort1[0].toLowerCase() > sort2[0].toLowerCase()) {
        return 1
      }

      return 0;
    });
  }

  ngOnInit(): void {
    this.currentUser= this.ticketService.currentUser;
    this.userID = "";
  }
}