/* ==========================================
   BAIX NEON GRID OS
   FINANCE CORE v1
========================================== */


const STORAGE_KEY =
    "baix-finance-core-v1";


/* ==========================================
   DEFAULT DATABASE
========================================== */

const defaultDatabase = {

    accounts: [],

    transactions: [],

    budgets: [],

    debts: []

};


/* ==========================================
   LOAD DATABASE
========================================== */

let db =
    JSON.parse(
        localStorage.getItem(
            STORAGE_KEY
        )
    ) || defaultDatabase;


/* ==========================================
   SAVE
========================================== */

function saveDatabase() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(db)
    );

}


/* ==========================================
   HELPERS
========================================== */

function money(value) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(value || 0);

}


function today() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function selectedMonth() {

    return document
        .getElementById(
            "monthPicker"
        )
        .value;

}


function transactionMonth(
    transaction
) {

    return transaction.date
        .slice(0, 7);

}


/* ==========================================
   INITIAL MONTH
========================================== */

function initializeMonth() {

    const picker =
        document.getElementById(
            "monthPicker"
        );


    const now =
        new Date();


    picker.value =
        now.getFullYear() +
        "-" +
        String(
            now.getMonth() + 1
        ).padStart(2, "0");


    picker.addEventListener(
        "change",
        renderAll
    );

}


initializeMonth();


/* ==========================================
   ACCOUNT SELECT
========================================== */

function renderAccountSelect() {

    const select =
        document.getElementById(
            "transactionAccount"
        );


    select.innerHTML = "";


    if (
        db.accounts.length === 0
    ) {

        select.innerHTML =
            `<option value="">
                Belum ada rekening
             </option>`;

        return;

    }


    db.accounts.forEach(
        account => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                account.id;


            option.textContent =
                account.name;


            select.appendChild(
                option
            );

        }
    );

}



/* ==========================================
   TRANSFER ACCOUNT SELECT
========================================== */

function renderTransferAccountSelect() {

    const from =
        document.getElementById(
            "transferFrom"
        );

    const to =
        document.getElementById(
            "transferTo"
        );


    from.innerHTML = "";

    to.innerHTML = "";


    if (
        db.accounts.length < 2
    ) {

        from.innerHTML =
            `<option value="">
                Minimal 2 rekening
            </option>`;

        to.innerHTML =
            `<option value="">
                Minimal 2 rekening
            </option>`;

        return;
    }


    db.accounts.forEach(
        account => {

            const optionFrom =
                document.createElement(
                    "option"
                );

            optionFrom.value =
                account.id;

            optionFrom.textContent =
                `${account.name} — ${money(
                    calculateAccountBalance(
                        account
                    )
                )}`;


            const optionTo =
                document.createElement(
                    "option"
                );

            optionTo.value =
                account.id;

            optionTo.textContent =
                `${account.name} — ${money(
                    calculateAccountBalance(
                        account
                    )
                )}`;


            from.appendChild(
                optionFrom
            );

            to.appendChild(
                optionTo
            );

        }
    );

}


/* ==========================================
   CALCULATE ACCOUNT BALANCE
========================================== */

function calculateAccountBalance(
    account
) {

    let balance =
        Number(
            account.initialBalance || 0
        );


    db.transactions.forEach(
        transaction => {

            /* ==========================
               INCOME
            ========================== */

            if (
                transaction.type === "income" &&
                transaction.accountId === account.id
            ) {

                balance +=
                    Number(
                        transaction.amount
                    );

            }


            /* ==========================
               EXPENSE
            ========================== */

            if (
                transaction.type === "expense" &&
                transaction.accountId === account.id
            ) {

                balance -=
                    Number(
                        transaction.amount
                    );

            }


            /* ==========================
               TRANSFER OUT
            ========================== */

            if (
                transaction.type === "transfer" &&
                transaction.fromAccountId === account.id
            ) {

                balance -=
                    Number(
                        transaction.amount
                    );

            }


            /* ==========================
               TRANSFER IN
            ========================== */

            if (
                transaction.type === "transfer" &&
                transaction.toAccountId === account.id
            ) {

                balance +=
                    Number(
                        transaction.amount
                    );

            }

        }
    );


    return balance;

}


/* ==========================================
   TOTAL BALANCE
========================================== */

function calculateTotalBalance() {

    return db.accounts.reduce(
        (
            total,
            account
        ) => {

            return total +
                calculateAccountBalance(
                    account
                );

        },
        0
    );

}


/* ==========================================
   MONTHLY TOTALS
========================================== */

function calculateMonthlyTotals() {

    const month =
        selectedMonth();


    let income = 0;

    let expense = 0;


    db.transactions.forEach(
        transaction => {

            if (
                transactionMonth(
                    transaction
                ) !== month
            ) {

                return;

            }


            if (
                transaction.type
                === "income"
            ) {

                income +=
                    transaction.amount;

            }


            if (
                transaction.type
                === "expense"
            ) {

                expense +=
                    transaction.amount;

            }

        }
    );


    return {

        income,

        expense,

        saving:
            calculateMonthlySaving()

    };

}


/* ==========================================
   SAVING
========================================== */

function calculateMonthlySaving() {

    /*
       Untuk versi awal,
       saving = income - expense.

       Nanti bisa dibuat
       rekening tabungan khusus.
    */


    const month =
        selectedMonth();


    let income = 0;

    let expense = 0;


    db.transactions.forEach(
        transaction => {

            if (
                transactionMonth(
                    transaction
                ) !== month
            ) {

                return;

            }


            if (
                transaction.type
                === "income"
            ) {

                income +=
                    transaction.amount;

            }


            if (
                transaction.type
                === "expense"
            ) {

                expense +=
                    transaction.amount;

            }

        }
    );


    return Math.max(
        income - expense,
        0
    );

}


/* ==========================================
   RENDER SUMMARY
========================================== */

function renderSummary() {

    const totals =
        calculateMonthlyTotals();


    document.getElementById(
        "totalBalance"
    ).textContent =
        money(
            calculateTotalBalance()
        );


    document.getElementById(
        "monthIncome"
    ).textContent =
        money(
            totals.income
        );


    document.getElementById(
        "monthExpense"
    ).textContent =
        money(
            totals.expense
        );


    document.getElementById(
        "monthSaving"
    ).textContent =
        money(
            totals.saving
        );

}


/* ==========================================
   RENDER ACCOUNTS
========================================== */

function renderAccounts() {

    const container =
        document.getElementById(
            "accounts"
        );


    container.innerHTML = "";


    if (
        db.accounts.length === 0
    ) {

        container.innerHTML = `

            <div class="empty">

                Belum ada sumber dana.<br>

                Tambahkan rekening,
                cash atau e-wallet.

            </div>

        `;

        return;

    }


    db.accounts.forEach(
        account => {

            const balance =
                calculateAccountBalance(
                    account
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "account-card";


            card.innerHTML = `

                <button
                    class="account-delete"
                    data-id="${account.id}"
                >
                    ×
                </button>

                <small>
                    ${account.type.toUpperCase()}
                </small>

                <strong>
                    ${money(balance)}
                </strong>

                <span>
                    ${account.name}
                </span>

            `;


            card
                .querySelector(
                    ".account-delete"
                )
                .onclick = () => {

                    deleteAccount(
                        account.id
                    );

                };


            container.appendChild(
                card
            );

        }
    );

}


/* ==========================================
   DELETE ACCOUNT
========================================== */

function deleteAccount(id) {

    const used =
        db.transactions.some(
            transaction =>
                transaction.accountId
                === id
        );


    if (used) {

        alert(
            "Rekening tidak bisa dihapus karena sudah memiliki transaksi."
        );

        return;

    }


    if (
        !confirm(
            "Hapus rekening ini?"
        )
    ) {

        return;

    }


    db.accounts =
        db.accounts.filter(
            account =>
                account.id !== id
        );


    saveDatabase();

    renderAll();

}


/* ==========================================
   OPEN TRANSACTION
========================================== */

function openTransactionModal(
    type
) {

    const modal =
        document.getElementById(
            "modal"
        );


    document.getElementById(
        "transactionType"
    ).value = type;


    document.getElementById(
        "modalTitle"
    ).textContent =
        type === "income"
            ? "＋ PEMASUKAN"
            : "− PENGELUARAN";


    document.getElementById(
        "transactionDate"
    ).value =
        today();


    document.getElementById(
        "transactionAmount"
    ).value = "";


    document.getElementById(
        "transactionNote"
    ).value = "";


    renderAccountSelect();


    modal.classList.remove(
        "hidden"
    );

}


/* ==========================================
   CLOSE TRANSACTION
========================================== */

function closeTransactionModal() {

    document
        .getElementById(
            "modal"
        )
        .classList.add(
            "hidden"
        );

}


/* ==========================================
   BUTTONS
========================================== */

document.getElementById(
    "openIncome"
).onclick = () => {

    openTransactionModal(
        "income"
    );

};


document.getElementById(
    "openExpense"
).onclick = () => {

    openTransactionModal(
        "expense"
    );

};

/* ==========================================
   OPEN TRANSFER
========================================== */

document.getElementById(
    "openTransfer"
).onclick = () => {

    renderTransferAccountSelect();


    document.getElementById(
        "transferDate"
    ).value =
        today();


    document.getElementById(
        "transferAmount"
    ).value = "";


    document.getElementById(
        "transferNote"
    ).value = "";


    const modal =
        document.getElementById(
            "transferModal"
        );


    modal.classList.remove(
        "hidden"
    );

};

/* ==========================================
   CLOSE TRANSFER
========================================== */

document.getElementById(
    "closeTransferModal"
).onclick = () => {

    document.getElementById(
        "transferModal"
    ).classList.add(
        "hidden"
    );

};

/* ==========================================
   SUBMIT TRANSFER
========================================== */

document.getElementById(
    "transferForm"
).onsubmit =
    event => {

        event.preventDefault();


        const fromAccountId =
            document.getElementById(
                "transferFrom"
            ).value;


        const toAccountId =
            document.getElementById(
                "transferTo"
            ).value;


        const amount =
            Number(
                document.getElementById(
                    "transferAmount"
                ).value
            );


        const date =
            document.getElementById(
                "transferDate"
            ).value;


        const note =
            document.getElementById(
                "transferNote"
            ).value;


        /* ==========================
           VALIDATION
        ========================== */

        if (
            !fromAccountId ||
            !toAccountId
        ) {

            alert(
                "Pilih rekening asal dan tujuan."
            );

            return;

        }


        if (
            fromAccountId ===
            toAccountId
        ) {

            alert(
                "Rekening asal dan tujuan tidak boleh sama."
            );

            return;

        }


        if (
            !amount ||
            amount <= 0
        ) {

            alert(
                "Jumlah transfer tidak valid."
            );

            return;

        }


        const fromAccount =
            db.accounts.find(
                account =>
                    account.id ===
                    fromAccountId
            );


        const toAccount =
            db.accounts.find(
                account =>
                    account.id ===
                    toAccountId
            );


        if (
            !fromAccount ||
            !toAccount
        ) {

            alert(
                "Rekening tidak ditemukan."
            );

            return;

        }


        /* ==========================
           CHECK BALANCE
        ========================== */

        const sourceBalance =
            calculateAccountBalance(
                fromAccount
            );


        if (
            amount >
            sourceBalance
        ) {

            alert(
                `Saldo ${fromAccount.name} tidak cukup.\n\n` +
                `Saldo tersedia: ${money(
                    sourceBalance
                )}\n` +
                `Transfer: ${money(
                    amount
                )}`
            );

            return;

        }


        /* ==========================
           CREATE TRANSFER
        ========================== */

        const transfer = {

            id:
                crypto.randomUUID(),

            type:
                "transfer",

            date,

            amount,

            fromAccountId,

            toAccountId,

            category:
                "Transfer",

            note

        };


        db.transactions.push(
            transfer
        );


        saveDatabase();


        document.getElementById(
            "transferForm"
        ).reset();


        document.getElementById(
            "transferModal"
        ).classList.add(
            "hidden"
        );


        renderAll();


        showToast(
            `TRANSFER ${money(amount)} BERHASIL`
        );

    };


document.getElementById(
    "closeModal"
).onclick =
    closeTransactionModal;


/* ==========================================
   SUBMIT TRANSACTION
========================================== */

document.getElementById(
    "transactionForm"
).onsubmit =
    event => {

        event.preventDefault();


        const type =
            document.getElementById(
                "transactionType"
            ).value;


        const amount =
            Number(
                document.getElementById(
                    "transactionAmount"
                ).value
            );


        const accountId =
            document.getElementById(
                "transactionAccount"
            ).value;


        if (
            !accountId
        ) {

            alert(
                "Tambahkan rekening terlebih dahulu."
            );

            return;

        }


        const transaction = {

            id:
                crypto.randomUUID(),

            type,

            date:
                document.getElementById(
                    "transactionDate"
                ).value,

            amount,

            category:
                document.getElementById(
                    "transactionCategory"
                ).value,

            accountId,

            note:
                document.getElementById(
                    "transactionNote"
                ).value

        };


        db.transactions.push(
            transaction
        );


        saveDatabase();

        closeTransactionModal();

        renderAll();

        showToast(
            "TRANSAKSI TERSIMPAN"
        );

    };


/* ==========================================
   ACCOUNT MODAL
========================================== */

document.getElementById(
    "openAccount"
).onclick = () => {

    document
        .getElementById(
            "accountModal"
        )
        .classList.remove(
            "hidden"
        );

};


document.getElementById(
    "closeAccountModal"
).onclick = () => {

    document
        .getElementById(
            "accountModal"
        )
        .classList.add(
            "hidden"
        );

};


/* ==========================================
   ADD ACCOUNT
========================================== */

document.getElementById(
    "accountForm"
).onsubmit =
    event => {

        event.preventDefault();


        const account = {

            id:
                crypto.randomUUID(),

            name:
                document.getElementById(
                    "accountName"
                ).value,

            type:
                document.getElementById(
                    "accountType"
                ).value,

            initialBalance:
                Number(
                    document.getElementById(
                        "accountBalance"
                    ).value
                )

        };


        db.accounts.push(
            account
        );


        saveDatabase();


        document
            .getElementById(
                "accountForm"
            )
            .reset();


        document
            .getElementById(
                "accountModal"
            )
            .classList.add(
                "hidden"
            );


        renderAll();


        showToast(
            "REKENING DITAMBAHKAN"
        );

    };


/* ==========================================
   RENDER TRANSACTIONS
========================================== */

function renderTransactions() {

    const container =
        document.getElementById(
            "transactionList"
        );


    container.innerHTML = "";


    const month =
        selectedMonth();


    const transactions =
        db.transactions
            .filter(
                transaction =>
                    transactionMonth(
                        transaction
                    ) === month
            )
            .sort(
                (a, b) =>
                    b.date.localeCompare(
                        a.date
                    )
            );


    if (
        transactions.length === 0
    ) {

        container.innerHTML = `

            <div class="empty">

                Belum ada transaksi
                pada bulan ini.

            </div>

        `;

        return;

    }


    transactions.forEach(
        transaction => {

            const account =
                db.accounts.find(
                    item =>
                        item.id ===
                        transaction.accountId
                );


            const fromAccount =
                transaction.type === "transfer"
                    ? db.accounts.find(
                        item =>
                            item.id ===
                            transaction.fromAccountId
                    )
                    : null;


            const toAccount =
                transaction.type === "transfer"
                    ? db.accounts.find(
                        item =>
                            item.id ===
                            transaction.toAccountId
                    )
                    : null;


            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "transaction " +
                (
                    transaction.type === "income"
                        ? "income-tx"
                        : transaction.type === "expense"
                            ? "expense-tx"
                            : "transfer-tx"
                );


            const sign =
                transaction.type === "income"
                    ? "+"
                    : transaction.type === "expense"
                        ? "-"
                        : "↔";


            const accountText =
                transaction.type === "transfer"

                    ? `${fromAccount
                        ? fromAccount.name
                        : "Unknown"
                      } → ${
                        toAccount
                        ? toAccount.name
                        : "Unknown"
                      }`

                    : account
                        ? account.name
                        : "Unknown";


            element.innerHTML = `

                <div class="transaction-date">

                    ${transaction.date
                        .split("-")
                        .reverse()
                        .slice(0, 2)
                        .join("/")
                    }

                </div>


                <div class="transaction-info">

                    <strong>
                        ${transaction.category}
                    </strong>


                    <small>

                        ${accountText}

                        ${
                            transaction.note
                                ? " • " +
                                  transaction.note
                                : ""
                        }

                    </small>

                </div>


                <div class="transaction-amount">

                    ${sign}
                    ${money(
                        transaction.amount
                    )}

                </div>


                <div class="transaction-actions">

                    <button
                        class="transaction-edit"
                        data-id="${transaction.id}"
                    >
                        EDIT
                    </button>


                    <button
                        class="transaction-delete"
                        data-id="${transaction.id}"
                    >
                        HAPUS
                    </button>

                </div>

            `;


            container.appendChild(
                element
            );

        }
    );


    /* ==========================================
       EDIT TRANSACTION BUTTON
    ========================================== */

    container
        .querySelectorAll(
            ".transaction-edit"
        )
        .forEach(
            button => {

                button.onclick = () => {

                    editTransaction(
                        button.dataset.id
                    );

                };

            }
        );


    /* ==========================================
       DELETE TRANSACTION BUTTON
    ========================================== */

    container
        .querySelectorAll(
            ".transaction-delete"
        )
        .forEach(
            button => {

                button.onclick = () => {

                    deleteTransaction(
                        button.dataset.id
                    );

                };

            }
        );

}


/* ==========================================
   BUDGET
========================================== */

function renderBudgets() {

    const container =
        document.getElementById(
            "budgetList"
        );


    container.innerHTML = "";


    const month =
        selectedMonth();


    const budgets =
        db.budgets.filter(
            budget =>
                budget.month === month
        );


    if (
        budgets.length === 0
    ) {

        container.innerHTML = `

            <div class="empty">

                Belum ada budget.
                Buat budget agar sistem
                bisa memperingatkan
                pengeluaran berlebihan.

            </div>

        `;

        return;

    }


    budgets.forEach(
        budget => {

            const spent =
                db.transactions
                    .filter(
                        transaction =>
                            transaction.type
                            === "expense" &&
                            transaction.category
                            === budget.category &&
                            transactionMonth(
                                transaction
                            ) === month
                    )
                    .reduce(
                        (
                            sum,
                            transaction
                        ) =>
                            sum +
                            transaction.amount,
                        0
                    );


            const percentage =
                Math.min(
                    (
                        spent /
                        budget.limit
                    ) * 100,
                    100
                );


            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "budget-card";


            element.innerHTML = `

                <div class="budget-top">

                    <strong>
                        ${budget.category}
                    </strong>

                    <span>
                        ${money(spent)}
                        /
                        ${money(
                            budget.limit
                        )}
                    </span>

                </div>

                <div class="budget-bar">

                    <i
                        style="width:${percentage}%"
                    ></i>

                </div>

            `;


            container.appendChild(
                element
            );

        }
    );

}


/* ==========================================
   ADD BUDGET
========================================== */

document.getElementById(
    "addBudget"
).onclick = () => {

    const category =
        prompt(
            "Kategori budget?\nContoh: Makanan"
        );


    if (!category) return;


    const limit =
        Number(
            prompt(
                "Batas budget bulan ini?"
            )
        );


    if (
        !limit ||
        limit <= 0
    ) {

        return;

    }


    db.budgets.push({

        id:
            crypto.randomUUID(),

        month:
            selectedMonth(),

        category,

        limit

    });


    saveDatabase();

    renderBudgets();

    showToast(
        "BUDGET DITAMBAHKAN"
    );

};


/* ==========================================
   EXPORT CSV
========================================== */

document.getElementById(
    "exportCsv"
).onclick = () => {

    const month =
        selectedMonth();


    const transactions =
        db.transactions.filter(
            transaction =>
                transactionMonth(
                    transaction
                ) === month
        );


    let csv =
        "Tanggal,Jenis,Kategori,Rekening,Jumlah,Catatan\n";


    transactions.forEach(
        transaction => {

            const account =
                db.accounts.find(
                    item =>
                        item.id ===
                        transaction.accountId
                );


            csv += [

                transaction.date,

                transaction.type,

                transaction.category,

                account
                    ? account.name
                    : "",

                transaction.amount,

                (
                    transaction.note
                    || ""
                ).replace(
                    /,/g,
                    " "
                )

            ].join(",") + "\n";

        }
    );


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        `BAIX-FINANCE-${month}.csv`;


    link.click();


    URL.revokeObjectURL(
        url
    );


    showToast(
        "STATEMENT DIEXPORT"
    );

};


/* ==========================================
   RESET
========================================== */

document.getElementById(
    "clearTransactions"
).onclick = () => {

    const confirmation =
        prompt(
            "Ketik RESET untuk menghapus SEMUA transaksi, rekening dan budget."
        );


    if (
        confirmation !== "RESET"
    ) {

        return;

    }


    db =
        JSON.parse(
            JSON.stringify(
                defaultDatabase
            )
        );


    saveDatabase();

    renderAll();

    showToast(
        "DATABASE FINANCE DIRESET"
    );

};


/* ==========================================
   TOAST
========================================== */

function showToast(
    message
) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.toastTimer
    );


    window.toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            1800
        );

}


/* ==========================================
   RENDER ALL
========================================== */

function renderAll() {

    renderSummary();

    renderAccounts();

    renderAccountSelect();

    renderTransferAccountSelect();

    renderTransactions();

    renderBudgets();

}

/* ==========================================
   DELETE TRANSACTION
========================================== */

function deleteTransaction(id) {

    const transaction =
        db.transactions.find(
            item => item.id === id
        );


    if (!transaction) {

        alert(
            "Transaksi tidak ditemukan."
        );

        return;

    }


    const confirmed =
        confirm(
            `Hapus transaksi ini?\n\n` +
            `Tanggal: ${transaction.date}\n` +
            `Kategori: ${transaction.category}\n` +
            `Jumlah: ${money(transaction.amount)}\n\n` +
            `Data yang dihapus tidak dapat dikembalikan.`
        );


    if (!confirmed) {

        return;

    }


    db.transactions =
        db.transactions.filter(
            item => item.id !== id
        );


    saveDatabase();


    renderAll();


    showToast(
        "TRANSAKSI BERHASIL DIHAPUS"
    );

} 
/* ==========================================
   DELETE TRANSACTION
========================================== */

function deleteTransaction(id) {

    const transaction =
        db.transactions.find(
            item => item.id === id
        );


    if (!transaction) {

        alert(
            "Transaksi tidak ditemukan."
        );

        return;

    }


    const confirmed =
        confirm(
            `Hapus transaksi ini?\n\n` +
            `Tanggal: ${transaction.date}\n` +
            `Kategori: ${transaction.category}\n` +
            `Jumlah: ${money(transaction.amount)}\n\n` +
            `Data yang dihapus tidak dapat dikembalikan.`
        );


    if (!confirmed) {

        return;

    }


    db.transactions =
        db.transactions.filter(
            item => item.id !== id
        );


    saveDatabase();


    renderAll();


    showToast(
        "TRANSAKSI BERHASIL DIHAPUS"
    );

}


/* ==========================================
   INITIAL RENDER
========================================== */

renderAll();
