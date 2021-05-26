import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountComponent } from '../account/account.component';
import { API, graphqlOperation } from 'aws-amplify';
import { listAccounts } from 'src/graphql/queries';
import { createAccount, updateAccount } from 'src/graphql/mutations';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  accounts: any[] = [];
  categories: any[] = [];
  searchQuery = '';

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.accounts = [];
    this.categories = [];
    this.loadInitialData().then(() => {
        this.loadAccountsData();
    });
  }

  async loadInitialData() {
  }

  async loadAccountsData() {
    const accountsResponse = await API.graphql(graphqlOperation(listAccounts));
    // const accountsResponse = await API.graphql({query: listAccounts, authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS });

    this.accounts = (accountsResponse as any).data.listAccounts.items;

    this.categories = [...new Set(this.accounts.map(account => account.category))];
    this.categories.sort((a,b) => a.name === b.name ? 0 : a.name < b.name ? -1 : 1);
  }

  getAccountsByCategory(category: string) {
    return this.accounts.filter(account => account.category === category);
  }

  showDialog(isAdd: boolean, account?: Account) {
    // console.log('addProduct clicked');
    // const addProductResponse = await API.graphql(graphqlOperation(createProduct, {input: this.testProduct}));
    // console.log(addProductResponse);

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
            this.addAccountAsync(result.AccountData).then(() => {
                this.loadAccountsData();
            });
        } else {
            this.editAccountAsync(result.AccountData).then(() => {
                this.loadAccountsData();
            });
        }
    });
  }  

  async addAccountAsync(account: any) {
    const addAccountRequest = {
        service: account.service,
        owner: account.owner,
        // belongs_to: account.belongs_to,
        category: account.category,
        url: account.url,
        username: account.username,
        password: account.password,
        // email: account.email,
        notes: account.notes
    };
    const addAccountResponse = await API.graphql(graphqlOperation(createAccount, { input: addAccountRequest }));
  }

  async editAccountAsync(account: any) {
    const editAccountRequest = {
        id: account.id,
        service: account.service,
        owner: account.owner,
        // belongs_to: account.belongs_to,
        category: account.category,
        url: account.url,
        username: account.username,
        password: account.password,
        // email: account.email,
        notes: account.notes
    };
    const editAccountResponse = await API.graphql(graphqlOperation(updateAccount, { input: editAccountRequest }));
  }
}
