import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountComponent } from '../account/account.component';
import { API, graphqlOperation } from 'aws-amplify';
import { listAccounts } from 'src/graphql/queries';
import { createAccount, deleteAccount, updateAccount } from 'src/graphql/mutations';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  accounts: any[] = [];
  searchQuery = '';
  hideCategory: any = {};

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.accounts = [];
    this.loadInitialData().then(() => {
        this.loadAccountsData();
    });
  }

  async loadInitialData() {
  }

  async loadAccountsData() {
    const accountsResponse = await API.graphql(graphqlOperation(listAccounts));

    this.accounts = (accountsResponse as any).data.listAccounts.items;
  }

  getCategories() {
    const tempAccounts = this.getAccountsByFilter()
    const categories = [...new Set(tempAccounts.map(account => account.category))];
    categories.sort((a,b) => a.name === b.name ? 0 : a.name < b.name ? -1 : 1);
    this.hideCategory = categories.reduce((current, item) => { 
      current[item] = false;
      return current;
    }, {});
    return categories;
  }

  getAccountsByFilter() {
    return this.accounts
      .filter(account => account.service.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

  getAccountsByCategory(category: string) {
    return this.getAccountsByFilter()
      .filter(account => account.category === category);
  }

  showDialog(isAdd: boolean, account?: Account) {
    let accountData = {}

    if (!isAdd) {
        accountData = { ...account };
    }

    let dialogBoxWidth = '60%';

    if (window.matchMedia('(min-width: 768px)').matches) { // large screens
        dialogBoxWidth = '60%';
    } else if (window.matchMedia('(max-width: 767px)').matches) { // small screens
        dialogBoxWidth = '98%';
    }
  

    const dialogRef = this.dialog.open(AccountComponent, {
        maxWidth: dialogBoxWidth,
        width: dialogBoxWidth,
        // height: '90%',
        data: {
            IsAdd: isAdd,
            AccountData: accountData
        }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
        if (result === undefined || result == "Cancel") {
            return;
        }

        if (result.IsAdd) {
            this.addAccountAsync(result.AccountData);
        } else {
            this.editAccountAsync(result.AccountData);
        }
    });
  }  

  async addAccountAsync(account: any) {
    const addAccountRequest = {
        service: account.service,
        category: account.category,
        url: account.url,
        username: account.username,
        password: account.password,
        // email: account.email,
        notes: account.notes
    };
    await API.graphql(graphqlOperation(createAccount, { input: addAccountRequest }));
    this.loadAccountsData();
  }

  async editAccountAsync(account: any) {
    const editAccountRequest = {
        id: account.id,
        service: account.service,
        category: account.category,
        url: account.url,
        username: account.username,
        password: account.password,
        notes: account.notes
    };
    await API.graphql(graphqlOperation(updateAccount, { input: editAccountRequest }));
    this.loadAccountsData();
  }

  async deleteAccountAsync(account: any) {
    const deleteAccountRequest = {
        id: account.id,
    };
    await API.graphql(graphqlOperation(deleteAccount, { input: deleteAccountRequest }));
    this.loadAccountsData();
  }

  toggleCategories(state: boolean) {
    Object.keys(this.hideCategory).forEach((category: any) => {
      this.hideCategory[category] = state;
    });
  }

}
