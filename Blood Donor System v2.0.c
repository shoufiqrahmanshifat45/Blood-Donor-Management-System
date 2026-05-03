/*
 * ============================================================
 *     BLOOD DONOR MANAGEMENT SYSTEM  v2.0
 *     Language  : C
 *     Platform  : Windows / Linux / macOS (GCC)
 *     New       : Donation History (per donor, each date saved)
 * ============================================================
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <ctype.h>

#ifdef _WIN32
    #include <windows.h>
    #define CLEAR "cls"
    #define PAUSE system("pause")
#else
    #define CLEAR "clear"
    #define PAUSE printf("\nEnter key press korun..."); getchar(); getchar()
#endif

/* ─── Constants ─────────────────────────────────────────── */
#define MAX_DONORS        500
#define MAX_REQUESTS      200
#define MAX_DONATIONS     50      /* max donation history per donor */
#define DONOR_FILE        "donors.csv"
#define HISTORY_FILE      "donation_history.csv"
#define REQUEST_FILE      "requests.csv"
#define ADMIN_PASSWORD    "admin123"
#define VERSION           "2.0"

/* ─── Colours ───────────────────────────────────────────── */
#define RED     "\033[1;31m"
#define GREEN   "\033[1;32m"
#define YELLOW  "\033[1;33m"
#define CYAN    "\033[1;36m"
#define MAGENTA "\033[1;35m"
#define WHITE   "\033[1;37m"
#define RESET   "\033[0m"

/* ─── Blood Types ───────────────────────────────────────── */
const char *BLOOD_TYPES[] = {"A+","A-","B+","B-","AB+","AB-","O+","O-"};
#define BLOOD_TYPE_COUNT 8

/* ─── Structures ────────────────────────────────────────── */

/* One donation record */
typedef struct {
    int  donor_id;
    int  serial;               /* 1st, 2nd, 3rd ... */
    char date[20];             /* DD-MM-YYYY         */
    char hospital[80];         /* optional            */
} DonationRecord;

/* Donor */
typedef struct {
    int  id;
    char name[50];
    int  age;
    char blood_type[5];
    char phone[15];
    char email[50];
    char address[100];
    char area[30];
    char gender[10];
    int  donation_count;       /* total times donated */
    char last_donated[20];     /* most recent date    */
    int  is_available;
    char registered_date[20];
} Donor;

/* Blood Request */
typedef struct {
    int  req_id;
    char patient_name[50];
    char blood_type[5];
    int  units_needed;
    char hospital[80];
    char contact[15];
    char date_needed[20];
    char status[20];
    char request_date[20];
} BloodRequest;

/* ─── Globals ────────────────────────────────────────────── */
Donor          donors[MAX_DONORS];
DonationRecord history[MAX_DONORS * MAX_DONATIONS];
BloodRequest   requests[MAX_REQUESTS];
int            donor_count   = 0;
int            history_count = 0;
int            request_count = 0;

/* ═══════════════════════════════════════════════════════════
 *  UTILITIES
 * ═══════════════════════════════════════════════════════════ */

void clrscr(void) { system(CLEAR); }

void print_line(char c) {
    printf(CYAN);
    for (int i = 0; i < 62; i++) printf("%c", c);
    printf(RESET "\n");
}

void get_current_date(char *buf) {
    time_t t = time(NULL);
    struct tm *tm_info = localtime(&t);
    strftime(buf, 20, "%d-%m-%Y", tm_info);
}

int get_next_donor_id(void) {
    int max = 1000;
    for (int i = 0; i < donor_count; i++)
        if (donors[i].id >= max) max = donors[i].id + 1;
    return max;
}

int get_next_request_id(void) {
    int max = 2000;
    for (int i = 0; i < request_count; i++)
        if (requests[i].req_id >= max) max = requests[i].req_id + 1;
    return max;
}

int str_contains(const char *hay, const char *needle) {
    char h[200], n[100]; int i;
    for (i = 0; hay[i];    i++) h[i] = tolower((unsigned char)hay[i]);    h[i]=0;
    for (i = 0; needle[i]; i++) n[i] = tolower((unsigned char)needle[i]); n[i]=0;
    return strstr(h, n) != NULL;
}

int valid_blood_type(const char *bt) {
    for (int i = 0; i < BLOOD_TYPE_COUNT; i++)
        if (strcmp(bt, BLOOD_TYPES[i]) == 0) return 1;
    return 0;
}

void ordinal(int n, char *buf) {
    if      (n == 1) strcpy(buf, "1st");
    else if (n == 2) strcpy(buf, "2nd");
    else if (n == 3) strcpy(buf, "3rd");
    else             sprintf(buf, "%dth", n);
}

void print_banner(void) {
    clrscr();
    printf(RED "\n");
    printf("  +========================================================+\n");
    printf("  |                                                        |\n");
    printf("  |   " WHITE " ____  _     ___   ___  ____                " RED "    |\n");
    printf("  |   " WHITE "| __ )| |   / _ \\ / _ \\|  _ \\               " RED "   |\n");
    printf("  |   " WHITE "|  _ \\| |  | | | | | | | | | |              " RED "   |\n");
    printf("  |   " WHITE "| |_) | |__| |_| | |_| | |_| |              " RED "   |\n");
    printf("  |   " WHITE "|____/|_____\\___/ \\___/|____/               " RED "   |\n");
    printf("  |                                                        |\n");
    printf("  |      " YELLOW "DONOR MANAGEMENT SYSTEM  v%s" RED "               |\n", VERSION);
    printf("  |      " WHITE "Jibon Bachao, Rokto Dao!                  " RED "  |\n");
    printf("  +========================================================+\n");
    printf(RESET "\n");
}

/* ═══════════════════════════════════════════════════════════
 *  FILE I/O  — CSV format (readable in Notepad/Excel)
 * ═══════════════════════════════════════════════════════════ */

void save_donors(void) {
    FILE *fp = fopen(DONOR_FILE, "w");
    if (!fp) { printf(RED "  File save error!\n" RESET); return; }
    fprintf(fp, "ID|Name|Age|Gender|BloodType|Phone|Email|Area|Address"
                "|LastDonated|DonationCount|IsAvailable|RegisteredDate\n");
    for (int i = 0; i < donor_count; i++) {
        Donor *d = &donors[i];
        fprintf(fp, "%d|%s|%d|%s|%s|%s|%s|%s|%s|%s|%d|%d|%s\n",
                d->id, d->name, d->age, d->gender, d->blood_type,
                d->phone, d->email, d->area, d->address,
                d->last_donated, d->donation_count,
                d->is_available, d->registered_date);
    }
    fclose(fp);
}

void load_donors(void) {
    FILE *fp = fopen(DONOR_FILE, "r");
    if (!fp) { donor_count = 0; return; }
    char line[512];
    donor_count = 0;
    fgets(line, sizeof(line), fp); /* skip header */
    while (fgets(line, sizeof(line), fp) && donor_count < MAX_DONORS) {
        line[strcspn(line, "\r\n")] = 0;
        Donor *d = &donors[donor_count];
        char age_s[8], dc_s[8], av_s[4];
        int n = sscanf(line,
            "%d|%49[^|]|%7[^|]|%9[^|]|%4[^|]|%14[^|]|%49[^|]"
            "|%29[^|]|%99[^|]|%19[^|]|%7[^|]|%3[^|]|%19[^\n]",
            &d->id, d->name, age_s, d->gender, d->blood_type,
            d->phone, d->email, d->area, d->address,
            d->last_donated, dc_s, av_s, d->registered_date);
        if (n == 13) {
            d->age            = atoi(age_s);
            d->donation_count = atoi(dc_s);
            d->is_available   = atoi(av_s);
            donor_count++;
        }
    }
    fclose(fp);
}

/* Donation history — one row per donation */
void save_history(void) {
    FILE *fp = fopen(HISTORY_FILE, "w");
    if (!fp) return;
    fprintf(fp, "DonorID|DonorName|Serial|Date|Hospital\n");
    for (int i = 0; i < history_count; i++) {
        DonationRecord *r = &history[i];
        /* Look up donor name */
        char dname[50] = "Unknown";
        for (int j = 0; j < donor_count; j++)
            if (donors[j].id == r->donor_id) { strcpy(dname, donors[j].name); break; }
        fprintf(fp, "%d|%s|%d|%s|%s\n",
                r->donor_id, dname, r->serial, r->date, r->hospital);
    }
    fclose(fp);
}

void load_history(void) {
    FILE *fp = fopen(HISTORY_FILE, "r");
    if (!fp) { history_count = 0; return; }
    char line[512];
    history_count = 0;
    fgets(line, sizeof(line), fp); /* skip header */
    while (fgets(line, sizeof(line), fp) &&
           history_count < MAX_DONORS * MAX_DONATIONS) {
        line[strcspn(line, "\r\n")] = 0;
        DonationRecord *r = &history[history_count];
        char dname[50], serial_s[8];
        int n = sscanf(line, "%d|%49[^|]|%7[^|]|%19[^|]|%79[^\n]",
                       &r->donor_id, dname, serial_s, r->date, r->hospital);
        if (n >= 4) {
            r->serial = atoi(serial_s);
            history_count++;
        }
    }
    fclose(fp);
}

void save_requests(void) {
    FILE *fp = fopen(REQUEST_FILE, "w");
    if (!fp) return;
    fprintf(fp, "ReqID|PatientName|BloodType|UnitsNeeded|Hospital|Contact|DateNeeded|Status|RequestDate\n");
    for (int i = 0; i < request_count; i++) {
        BloodRequest *r = &requests[i];
        fprintf(fp, "%d|%s|%s|%d|%s|%s|%s|%s|%s\n",
                r->req_id, r->patient_name, r->blood_type, r->units_needed,
                r->hospital, r->contact, r->date_needed,
                r->status, r->request_date);
    }
    fclose(fp);
}

void load_requests(void) {
    FILE *fp = fopen(REQUEST_FILE, "r");
    if (!fp) { request_count = 0; return; }
    char line[512];
    request_count = 0;
    fgets(line, sizeof(line), fp);
    while (fgets(line, sizeof(line), fp) && request_count < MAX_REQUESTS) {
        line[strcspn(line, "\r\n")] = 0;
        BloodRequest *r = &requests[request_count];
        char units_s[8];
        int n = sscanf(line,
            "%d|%49[^|]|%4[^|]|%7[^|]|%79[^|]|%14[^|]|%19[^|]|%19[^|]|%19[^\n]",
            &r->req_id, r->patient_name, r->blood_type, units_s,
            r->hospital, r->contact, r->date_needed,
            r->status, r->request_date);
        if (n == 9) { r->units_needed = atoi(units_s); request_count++; }
    }
    fclose(fp);
}

/* ═══════════════════════════════════════════════════════════
 *  DISPLAY
 * ═══════════════════════════════════════════════════════════ */

void print_donor_header(void) {
    printf(CYAN "  %-6s %-20s %-5s %-6s %-14s %-15s %-7s %-10s\n",
           "ID","Name","Age","Blood","Phone","Area","Donated","Status");
    print_line('-');
    printf(RESET);
}

void print_donor_row(Donor *d) {
    const char *sc = d->is_available ? GREEN : YELLOW;
    const char *st = d->is_available ? "Available" : "Unavail.";
    printf("  %-6d %-20s %-5d " RED "%-6s" RESET " %-14s %-15s "
           MAGENTA "%-7d" RESET " %s%-10s" RESET "\n",
           d->id, d->name, d->age, d->blood_type,
           d->phone, d->area, d->donation_count, sc, st);
}

void print_donor_detail(Donor *d) {
    print_line('=');
    printf(YELLOW "  DONOR DETAILS\n" RESET);
    print_line('-');
    printf("  " CYAN "ID            : " WHITE "%d\n"   RESET, d->id);
    printf("  " CYAN "Name          : " WHITE "%s\n"   RESET, d->name);
    printf("  " CYAN "Age           : " WHITE "%d\n"   RESET, d->age);
    printf("  " CYAN "Gender        : " WHITE "%s\n"   RESET, d->gender);
    printf("  " CYAN "Blood Type    : " RED   "%s\n"   RESET, d->blood_type);
    printf("  " CYAN "Phone         : " WHITE "%s\n"   RESET, d->phone);
    printf("  " CYAN "Email         : " WHITE "%s\n"   RESET, d->email);
    printf("  " CYAN "Area          : " WHITE "%s\n"   RESET, d->area);
    printf("  " CYAN "Address       : " WHITE "%s\n"   RESET, d->address);
    printf("  " CYAN "Total Donated : " MAGENTA "%d times\n" RESET, d->donation_count);
    printf("  " CYAN "Last Donated  : " WHITE "%s\n"   RESET, d->last_donated);
    printf("  " CYAN "Registered    : " WHITE "%s\n"   RESET, d->registered_date);
    printf("  " CYAN "Status        : %s%s\n" RESET,
           d->is_available ? GREEN : YELLOW,
           d->is_available ? "Available" : "Unavailable");
    print_line('=');
}

/* Show all donation history for one donor */
void print_donation_history(int donor_id) {
    int found = 0;
    printf(MAGENTA "\n  --- Donation History ---\n" RESET);
    printf(CYAN "  %-6s %-15s %-30s\n", "No.", "Date", "Hospital/Note");
    print_line('-');
    printf(RESET);
    for (int i = 0; i < history_count; i++) {
        if (history[i].donor_id == donor_id) {
            char ord[8]; ordinal(history[i].serial, ord);
            printf("  " YELLOW "%-6s" RESET " %-15s %-30s\n",
                   ord, history[i].date,
                   strlen(history[i].hospital) > 0 ? history[i].hospital : "-");
            found++;
        }
    }
    if (found == 0)
        printf(YELLOW "  Kono donation history nei.\n" RESET);
    printf(CYAN "  Total: " MAGENTA "%d" CYAN " bar donate korsen.\n" RESET, found);
    print_line('-');
}

/* ═══════════════════════════════════════════════════════════
 *  DONATION HISTORY — ADD
 * ═══════════════════════════════════════════════════════════ */

void record_donation(Donor *d) {
    if (history_count >= MAX_DONORS * MAX_DONATIONS) {
        printf(RED "  History full!\n" RESET); return;
    }
    DonationRecord r;
    r.donor_id = d->id;
    r.serial   = d->donation_count + 1;  /* will be incremented after */

    /* Date */
    char today[20]; get_current_date(today);
    printf("  Donation date (DD-MM-YYYY) [Enter = today %s]: ", today);
    char input[25]; fgets(input, 25, stdin);
    input[strcspn(input, "\r\n")] = 0;
    if (strlen(input) == 0)
        strcpy(r.date, today);
    else
        strcpy(r.date, input);

    /* Hospital (optional) */
    printf("  Hospital/Note (optional, Enter to skip): ");
    fgets(r.hospital, 80, stdin);
    r.hospital[strcspn(r.hospital, "\r\n")] = 0;

    /* Commit */
    history[history_count++] = r;
    d->donation_count++;
    strcpy(d->last_donated, r.date);

    save_history();
    save_donors();

    char ord[8]; ordinal(r.serial, ord);
    printf(GREEN "\n  [OK] %s donation recorded! Date: %s\n" RESET,
           ord, r.date);
    printf(MAGENTA "  %s er total donation: %d bar\n" RESET,
           d->name, d->donation_count);
}

/* ═══════════════════════════════════════════════════════════
 *  DONOR MANAGEMENT
 * ═══════════════════════════════════════════════════════════ */

void add_donor(void) {
    if (donor_count >= MAX_DONORS) {
        printf(RED "  Max donor limit!\n" RESET); return;
    }
    clrscr();
    print_line('=');
    printf(GREEN "  NEW DONOR REGISTRATION\n" RESET);
    print_line('=');

    Donor d; memset(&d, 0, sizeof(Donor));
    d.id = get_next_donor_id();
    get_current_date(d.registered_date);
    strcpy(d.last_donated, "Never");
    d.donation_count = 0;
    d.is_available   = 1;

    printf("  Name         : "); fgets(d.name, 50, stdin);
    d.name[strcspn(d.name, "\n")] = 0;

    printf("  Age          : "); scanf("%d", &d.age); while (getchar()!='\n');

    printf("  Gender (Male/Female/Other): "); fgets(d.gender, 10, stdin);
    d.gender[strcspn(d.gender, "\n")] = 0;

    while (1) {
        printf("  Blood Type (A+/A-/B+/B-/AB+/AB-/O+/O-): ");
        fgets(d.blood_type, 5, stdin);
        d.blood_type[strcspn(d.blood_type, "\n")] = 0;
        for (int i = 0; d.blood_type[i]; i++)
            d.blood_type[i] = toupper((unsigned char)d.blood_type[i]);
        if (valid_blood_type(d.blood_type)) break;
        printf(RED "  Invalid! Try again.\n" RESET);
    }

    printf("  Phone        : "); fgets(d.phone, 15, stdin);
    d.phone[strcspn(d.phone, "\n")] = 0;

    printf("  Email        : "); fgets(d.email, 50, stdin);
    d.email[strcspn(d.email, "\n")] = 0;

    printf("  Area/Thana   : "); fgets(d.area, 30, stdin);
    d.area[strcspn(d.area, "\n")] = 0;

    printf("  Full Address : "); fgets(d.address, 100, stdin);
    d.address[strcspn(d.address, "\n")] = 0;

    if (d.age < 18 || d.age > 65)
        printf(YELLOW "  Warning: Ideal age 18-65.\n" RESET);

    donors[donor_count++] = d;
    save_donors();

    printf(GREEN "\n  [OK] Donor registered! ID: %d\n" RESET, d.id);

    /* Ask if they already donated before */
    printf(CYAN "\n  Ei donor ki age kono donate korechhen? (y/n): " RESET);
    char ans[4]; fgets(ans, 4, stdin);
    if (tolower(ans[0]) == 'y') {
        printf(YELLOW "  Koybar donate koreche? " RESET);
        int times; scanf("%d", &times); while(getchar()!='\n');
        Donor *dp = &donors[donor_count-1];
        for (int t = 0; t < times; t++) {
            printf(CYAN "\n  --- %d number donation ---\n" RESET, t+1);
            record_donation(dp);
        }
    }
    PAUSE;
}

void view_all_donors(void) {
    clrscr();
    print_line('=');
    printf(GREEN "  ALL DONORS (%d total)\n" RESET, donor_count);
    print_line('=');
    if (donor_count == 0) {
        printf(YELLOW "  Kono donor nei.\n" RESET); PAUSE; return;
    }
    print_donor_header();
    for (int i = 0; i < donor_count; i++)
        print_donor_row(&donors[i]);
    print_line('=');
    printf(CYAN "  Total: %d donors\n" RESET, donor_count);
    PAUSE;
}

void view_donor_history(void) {
    clrscr();
    print_line('=');
    printf(MAGENTA "  DONATION HISTORY\n" RESET);
    print_line('=');

    int id;
    printf("  Donor ID din: "); scanf("%d", &id); while(getchar()!='\n');

    int idx = -1;
    for (int i = 0; i < donor_count; i++)
        if (donors[i].id == id) { idx = i; break; }

    if (idx == -1) { printf(RED "  Donor not found!\n" RESET); PAUSE; return; }

    Donor *d = &donors[idx];
    printf(WHITE "\n  Donor: %s  |  Blood: " RED "%s" WHITE
           "  |  Total Donated: " MAGENTA "%d bar\n" RESET,
           d->name, d->blood_type, d->donation_count);

    print_donation_history(id);
    PAUSE;
}

void add_donation_for_donor(void) {
    clrscr();
    print_line('=');
    printf(GREEN "  NEW DONATION RECORD\n" RESET);
    print_line('=');

    int id;
    printf("  Donor ID din: "); scanf("%d", &id); while(getchar()!='\n');

    int idx = -1;
    for (int i = 0; i < donor_count; i++)
        if (donors[i].id == id) { idx = i; break; }

    if (idx == -1) { printf(RED "  Donor not found!\n" RESET); PAUSE; return; }

    Donor *d = &donors[idx];
    printf(WHITE "  Donor: %s | Blood: " RED "%s" WHITE
           " | Ekhon porjonto: " MAGENTA "%d bar donate korechhen\n\n" RESET,
           d->name, d->blood_type, d->donation_count);

    record_donation(d);
    PAUSE;
}

void edit_donor(void) {
    clrscr();
    print_line('=');
    printf(YELLOW "  EDIT DONOR INFO\n" RESET);
    print_line('=');

    int id;
    printf("  Donor ID din: "); scanf("%d", &id); while(getchar()!='\n');

    int idx = -1;
    for (int i = 0; i < donor_count; i++)
        if (donors[i].id == id) { idx = i; break; }

    if (idx == -1) { printf(RED "  Not found!\n" RESET); PAUSE; return; }

    Donor *d = &donors[idx];
    print_donor_detail(d);

    printf("\n  Ki update korben?\n");
    printf("  1. Phone\n  2. Email\n  3. Address\n  4. Area\n");
    printf("  5. Availability Status\n  6. Cancel\n");
    printf("  Choice: ");
    int ch; scanf("%d", &ch); while(getchar()!='\n');

    switch(ch) {
        case 1: printf("  New Phone: "); fgets(d->phone,15,stdin);
                d->phone[strcspn(d->phone,"\n")]=0; break;
        case 2: printf("  New Email: "); fgets(d->email,50,stdin);
                d->email[strcspn(d->email,"\n")]=0; break;
        case 3: printf("  New Address: "); fgets(d->address,100,stdin);
                d->address[strcspn(d->address,"\n")]=0; break;
        case 4: printf("  New Area: "); fgets(d->area,30,stdin);
                d->area[strcspn(d->area,"\n")]=0; break;
        case 5: d->is_available = !d->is_available;
                printf(GREEN "  Status: %s\n" RESET,
                       d->is_available?"Available":"Unavailable"); break;
        case 6: return;
        default: printf(RED "  Invalid!\n" RESET); PAUSE; return;
    }
    save_donors();
    printf(GREEN "  [OK] Updated!\n" RESET);
    PAUSE;
}

void delete_donor(void) {
    clrscr();
    print_line('=');
    printf(RED "  DELETE DONOR\n" RESET);
    print_line('=');

    int id;
    printf("  Donor ID din: "); scanf("%d", &id); while(getchar()!='\n');

    int idx = -1;
    for (int i = 0; i < donor_count; i++)
        if (donors[i].id == id) { idx = i; break; }

    if (idx == -1) { printf(RED "  Not found!\n" RESET); PAUSE; return; }

    printf(YELLOW "  Donor: %s (%s) — delete korben? (y/n): " RESET,
           donors[idx].name, donors[idx].blood_type);
    char c[4]; fgets(c, 4, stdin);
    if (tolower(c[0]) != 'y') { printf("  Cancelled.\n"); PAUSE; return; }

    /* Remove history for this donor */
    int new_hc = 0;
    for (int i = 0; i < history_count; i++)
        if (history[i].donor_id != id)
            history[new_hc++] = history[i];
    history_count = new_hc;

    for (int i = idx; i < donor_count-1; i++) donors[i] = donors[i+1];
    donor_count--;
    save_donors();
    save_history();
    printf(GREEN "  [OK] Deleted!\n" RESET);
    PAUSE;
}

/* ═══════════════════════════════════════════════════════════
 *  SEARCH
 * ═══════════════════════════════════════════════════════════ */

void search_by_blood_type(void) {
    clrscr(); print_line('=');
    printf(CYAN "  SEARCH BY BLOOD TYPE\n" RESET); print_line('=');
    char bt[5];
    printf("  Blood type: "); fgets(bt,5,stdin); bt[strcspn(bt,"\n")]=0;
    for (int i=0;bt[i];i++) bt[i]=toupper((unsigned char)bt[i]);
    int found=0;
    print_donor_header();
    for (int i=0;i<donor_count;i++)
        if (strcmp(donors[i].blood_type,bt)==0) { print_donor_row(&donors[i]); found++; }
    print_line('=');
    printf(found?GREEN"  %d jon pawa geche.\n"RESET:YELLOW"  Kono donor nei.\n"RESET, found);
    PAUSE;
}

void search_by_area(void) {
    clrscr(); print_line('=');
    printf(CYAN "  SEARCH BY AREA\n" RESET); print_line('=');
    char area[30];
    printf("  Area/Thana: "); fgets(area,30,stdin); area[strcspn(area,"\n")]=0;
    int found=0;
    print_donor_header();
    for (int i=0;i<donor_count;i++)
        if (str_contains(donors[i].area,area)) { print_donor_row(&donors[i]); found++; }
    print_line('=');
    printf(found?GREEN"  %d jon.\n"RESET:YELLOW"  Kono donor nei.\n"RESET, found);
    PAUSE;
}

void search_by_name(void) {
    clrscr(); print_line('=');
    printf(CYAN "  SEARCH BY NAME\n" RESET); print_line('=');
    char name[50];
    printf("  Name: "); fgets(name,50,stdin); name[strcspn(name,"\n")]=0;
    int found=0;
    for (int i=0;i<donor_count;i++)
        if (str_contains(donors[i].name,name)) { print_donor_detail(&donors[i]); found++; }
    printf(found?GREEN"  %d jon pawa geche.\n"RESET:YELLOW"  Kono donor nei.\n"RESET, found);
    PAUSE;
}

void search_available(void) {
    clrscr(); print_line('=');
    printf(GREEN "  AVAILABLE DONORS\n" RESET); print_line('=');
    int found=0;
    print_donor_header();
    for (int i=0;i<donor_count;i++)
        if (donors[i].is_available) { print_donor_row(&donors[i]); found++; }
    print_line('=');
    printf(GREEN "  Total available: %d\n" RESET, found);
    PAUSE;
}

/* ═══════════════════════════════════════════════════════════
 *  ALL DONATION HISTORY (admin view)
 * ═══════════════════════════════════════════════════════════ */

void view_all_history(void) {
    clrscr(); print_line('=');
    printf(MAGENTA "  ALL DONATION HISTORY (%d records)\n" RESET, history_count);
    print_line('=');
    if (history_count == 0) {
        printf(YELLOW "  Kono history nei.\n" RESET); PAUSE; return;
    }
    printf(CYAN "  %-6s %-20s %-6s %-15s %-30s\n",
           "ID","Donor Name","Serial","Date","Hospital");
    print_line('-'); printf(RESET);

    for (int i = 0; i < history_count; i++) {
        DonationRecord *r = &history[i];
        char dname[50] = "?";
        for (int j=0;j<donor_count;j++)
            if (donors[j].id==r->donor_id){strcpy(dname,donors[j].name);break;}
        char ord[8]; ordinal(r->serial, ord);
        printf("  %-6d %-20s " YELLOW "%-6s" RESET " %-15s %-30s\n",
               r->donor_id, dname, ord, r->date,
               strlen(r->hospital)>0?r->hospital:"-");
    }
    print_line('=');
    PAUSE;
}

/* Top donors by count */
void top_donors(void) {
    clrscr(); print_line('=');
    printf(YELLOW "  TOP DONORS (by donation count)\n" RESET);
    print_line('=');

    /* Simple selection sort copy */
    int order[MAX_DONORS];
    for (int i=0;i<donor_count;i++) order[i]=i;
    for (int i=0;i<donor_count-1;i++)
        for (int j=i+1;j<donor_count;j++)
            if (donors[order[j]].donation_count > donors[order[i]].donation_count) {
                int tmp=order[i]; order[i]=order[j]; order[j]=tmp;
            }

    printf(CYAN "  %-4s %-20s %-6s %-8s %-15s\n",
           "Rank","Name","Blood","Donated","Last Date");
    print_line('-'); printf(RESET);

    int show = donor_count < 10 ? donor_count : 10;
    for (int r=0;r<show;r++) {
        Donor *d = &donors[order[r]];
        printf("  " YELLOW "#%-3d" RESET " %-20s " RED "%-6s" RESET
               " " MAGENTA "%-8d" RESET " %-15s\n",
               r+1, d->name, d->blood_type, d->donation_count, d->last_donated);
    }
    print_line('=');
    PAUSE;
}

/* ═══════════════════════════════════════════════════════════
 *  BLOOD REQUESTS
 * ═══════════════════════════════════════════════════════════ */

void add_blood_request(void) {
    if (request_count >= MAX_REQUESTS) return;
    clrscr(); print_line('=');
    printf(RED "  NEW BLOOD REQUEST\n" RESET); print_line('=');

    BloodRequest r; memset(&r,0,sizeof(BloodRequest));
    r.req_id = get_next_request_id();
    get_current_date(r.request_date);
    strcpy(r.status,"Pending");

    printf("  Patient Name  : "); fgets(r.patient_name,50,stdin);
    r.patient_name[strcspn(r.patient_name,"\n")]=0;

    while(1){
        printf("  Blood Type    : "); fgets(r.blood_type,5,stdin);
        r.blood_type[strcspn(r.blood_type,"\n")]=0;
        for(int i=0;r.blood_type[i];i++) r.blood_type[i]=toupper((unsigned char)r.blood_type[i]);
        if(valid_blood_type(r.blood_type)) break;
        printf(RED "  Invalid!\n" RESET);
    }
    printf("  Units Needed  : "); scanf("%d",&r.units_needed); while(getchar()!='\n');
    printf("  Hospital Name : "); fgets(r.hospital,80,stdin);
    r.hospital[strcspn(r.hospital,"\n")]=0;
    printf("  Contact No.   : "); fgets(r.contact,15,stdin);
    r.contact[strcspn(r.contact,"\n")]=0;
    printf("  Date Needed   : "); fgets(r.date_needed,20,stdin);
    r.date_needed[strcspn(r.date_needed,"\n")]=0;

    requests[request_count++]=r;
    save_requests();
    printf(GREEN "\n  [OK] Request added! ID: %d\n" RESET, r.req_id);

    printf(CYAN "\n  Matching available donors (%s):\n" RESET, r.blood_type);
    print_donor_header();
    int found=0;
    for(int i=0;i<donor_count;i++)
        if(strcmp(donors[i].blood_type,r.blood_type)==0 && donors[i].is_available){
            print_donor_row(&donors[i]); found++;
        }
    if(!found) printf(YELLOW "  Kono available donor nei!\n" RESET);
    PAUSE;
}

void view_requests(void) {
    clrscr(); print_line('=');
    printf(YELLOW "  ALL BLOOD REQUESTS (%d)\n" RESET, request_count);
    print_line('=');
    if(!request_count){ printf(YELLOW "  Kono request nei.\n" RESET); PAUSE; return; }
    printf(CYAN "  %-6s %-20s %-6s %-5s %-25s %-10s\n",
           "ID","Patient","Blood","Units","Hospital","Status");
    print_line('-'); printf(RESET);
    for(int i=0;i<request_count;i++){
        BloodRequest *r=&requests[i];
        const char *col = strcmp(r->status,"Fulfilled")==0?GREEN:
                          strcmp(r->status,"Cancelled")==0?YELLOW:RED;
        printf("  %-6d %-20s " RED "%-6s" RESET " %-5d %-25s %s%-10s" RESET "\n",
               r->req_id,r->patient_name,r->blood_type,r->units_needed,
               r->hospital,col,r->status);
    }
    print_line('=');
    PAUSE;
}

void update_request_status(void) {
    int id; printf("  Request ID: "); scanf("%d",&id); while(getchar()!='\n');
    int idx=-1;
    for(int i=0;i<request_count;i++) if(requests[i].req_id==id){idx=i;break;}
    if(idx==-1){printf(RED "  Not found!\n" RESET);PAUSE;return;}
    printf("  1.Fulfilled  2.Cancelled  3.Pending\n  Choice: ");
    int ch; scanf("%d",&ch); while(getchar()!='\n');
    if(ch==1)      strcpy(requests[idx].status,"Fulfilled");
    else if(ch==2) strcpy(requests[idx].status,"Cancelled");
    else           strcpy(requests[idx].status,"Pending");
    save_requests();
    printf(GREEN "  [OK] Status updated!\n" RESET);
    PAUSE;
}

/* ═══════════════════════════════════════════════════════════
 *  STATISTICS
 * ═══════════════════════════════════════════════════════════ */

void show_statistics(void) {
    clrscr(); print_line('=');
    printf(MAGENTA "  STATISTICS\n" RESET); print_line('=');

    int bc[BLOOD_TYPE_COUNT]={0}; int avail=0; int total_donations=0;
    for(int i=0;i<donor_count;i++){
        for(int j=0;j<BLOOD_TYPE_COUNT;j++)
            if(strcmp(donors[i].blood_type,BLOOD_TYPES[j])==0) bc[j]++;
        if(donors[i].is_available) avail++;
        total_donations += donors[i].donation_count;
    }
    printf(CYAN "\n  Total Donors       : " WHITE "%d\n" RESET, donor_count);
    printf(GREEN "  Available          : %d\n" RESET, avail);
    printf(YELLOW "  Unavailable        : %d\n" RESET, donor_count-avail);
    printf(MAGENTA "  Total Donations    : %d times\n\n" RESET, total_donations);

    printf(CYAN "  Blood Type Distribution:\n" RESET);
    print_line('-');
    for(int j=0;j<BLOOD_TYPE_COUNT;j++){
        int bar = donor_count>0 ? bc[j]*20/donor_count : 0;
        printf("  " RED "%-5s" RESET " : " GREEN, BLOOD_TYPES[j]);
        for(int k=0;k<bar;k++) printf("#");
        printf(RESET " %d\n", bc[j]);
    }
    int pend=0,ful=0,can=0;
    for(int i=0;i<request_count;i++){
        if(strcmp(requests[i].status,"Pending")==0)   pend++;
        if(strcmp(requests[i].status,"Fulfilled")==0) ful++;
        if(strcmp(requests[i].status,"Cancelled")==0) can++;
    }
    print_line('-');
    printf(CYAN "\n  Blood Requests: %d total\n" RESET, request_count);
    printf(RED    "  Pending   : %d\n" RESET, pend);
    printf(GREEN  "  Fulfilled : %d\n" RESET, ful);
    printf(YELLOW "  Cancelled : %d\n" RESET, can);
    print_line('=');
    PAUSE;
}

void export_report(void) {
    FILE *fp=fopen("blood_donor_report.txt","w");
    if(!fp){printf(RED "  Cannot create report!\n" RESET);PAUSE;return;}
    char date[20]; get_current_date(date);
    fprintf(fp,"========================================\n");
    fprintf(fp,"  BLOOD DONOR REPORT  —  %s\n", date);
    fprintf(fp,"  Total Donors: %d\n",donor_count);
    fprintf(fp,"========================================\n\n");
    fprintf(fp,"%-6s %-20s %-5s %-6s %-14s %-15s %-8s %-12s\n",
            "ID","Name","Age","Blood","Phone","Area","Donated","Status");
    fprintf(fp,"--------------------------------------------------------------\n");
    for(int i=0;i<donor_count;i++){
        Donor *d=&donors[i];
        fprintf(fp,"%-6d %-20s %-5d %-6s %-14s %-15s %-8d %-12s\n",
                d->id,d->name,d->age,d->blood_type,d->phone,d->area,
                d->donation_count,d->is_available?"Available":"Unavailable");
    }
    fprintf(fp,"\n\n========= DONATION HISTORY =========\n");
    for(int i=0;i<history_count;i++){
        DonationRecord *r=&history[i];
        char dname[50]="?";
        for(int j=0;j<donor_count;j++)
            if(donors[j].id==r->donor_id){strcpy(dname,donors[j].name);break;}
        char ord[8]; ordinal(r->serial,ord);
        fprintf(fp,"  ID:%-6d %-20s %s donation  Date:%-15s Hospital:%s\n",
                r->donor_id,dname,ord,r->date,
                strlen(r->hospital)>0?r->hospital:"-");
    }
    fclose(fp);
    printf(GREEN "  [OK] Report saved: blood_donor_report.txt\n" RESET);
    PAUSE;
}

/* ═══════════════════════════════════════════════════════════
 *  ADMIN
 * ═══════════════════════════════════════════════════════════ */

int admin_login(void) {
    char pass[30]; int i=0; char c;
    printf("  Admin Password: ");
    while((c=getchar())!='\n' && i<29){ pass[i++]=c; printf("*"); }
    pass[i]=0; printf("\n");
    return strcmp(pass,ADMIN_PASSWORD)==0;
}

void admin_panel(void) {
    clrscr(); print_line('=');
    printf(MAGENTA "  ADMIN PANEL\n" RESET); print_line('=');
    if(!admin_login()){printf(RED "  Wrong password!\n" RESET);PAUSE;return;}
    int run=1;
    while(run){
        clrscr();
        printf(MAGENTA "  +==========================+\n" RESET);
        printf(MAGENTA "  |      ADMIN OPTIONS       |\n" RESET);
        printf(MAGENTA "  +==========================+\n" RESET);
        printf("  1. Delete Donor\n");
        printf("  2. Update Request Status\n");
        printf("  3. All Donation History\n");
        printf("  4. Top Donors\n");
        printf("  5. Export Report\n");
        printf("  6. Statistics\n");
        printf("  7. Back\n");
        printf("  Choice: ");
        int ch; scanf("%d",&ch); while(getchar()!='\n');
        switch(ch){
            case 1: delete_donor(); break;
            case 2: update_request_status(); break;
            case 3: view_all_history(); break;
            case 4: top_donors(); break;
            case 5: export_report(); break;
            case 6: show_statistics(); break;
            case 7: run=0; break;
            default: printf(RED "  Invalid!\n" RESET);
        }
    }
}

/* ═══════════════════════════════════════════════════════════
 *  MENUS
 * ═══════════════════════════════════════════════════════════ */

void donor_menu(void) {
    int run=1;
    while(run){
        clrscr();
        printf(GREEN "  +==========================+\n" RESET);
        printf(GREEN "  |    DONOR MANAGEMENT      |\n" RESET);
        printf(GREEN "  +==========================+\n" RESET);
        printf("  1. New Donor Register\n");
        printf("  2. All Donors Dekha\n");
        printf("  3. Donor Info Edit\n");
        printf("  4. Naya Donation Record Add\n");
        printf("  5. Donor er Donation History\n");
        printf("  6. Back\n");
        printf("  Choice: ");
        int ch; scanf("%d",&ch); while(getchar()!='\n');
        switch(ch){
            case 1: add_donor(); break;
            case 2: view_all_donors(); break;
            case 3: edit_donor(); break;
            case 4: add_donation_for_donor(); break;
            case 5: view_donor_history(); break;
            case 6: run=0; break;
            default: printf(RED "  Invalid!\n" RESET);
        }
    }
}

void search_menu(void) {
    int run=1;
    while(run){
        clrscr();
        printf(CYAN "  +==========================+\n" RESET);
        printf(CYAN "  |    DONOR SEARCH          |\n" RESET);
        printf(CYAN "  +==========================+\n" RESET);
        printf("  1. Blood Type diye\n");
        printf("  2. Area diye\n");
        printf("  3. Name diye\n");
        printf("  4. Available Donors\n");
        printf("  5. Back\n");
        printf("  Choice: ");
        int ch; scanf("%d",&ch); while(getchar()!='\n');
        switch(ch){
            case 1: search_by_blood_type(); break;
            case 2: search_by_area(); break;
            case 3: search_by_name(); break;
            case 4: search_available(); break;
            case 5: run=0; break;
            default: printf(RED "  Invalid!\n" RESET);
        }
    }
}

void request_menu(void) {
    int run=1;
    while(run){
        clrscr();
        printf(RED "  +==========================+\n" RESET);
        printf(RED "  |    BLOOD REQUESTS        |\n" RESET);
        printf(RED "  +==========================+\n" RESET);
        printf("  1. New Request\n");
        printf("  2. All Requests Dekha\n");
        printf("  3. Back\n");
        printf("  Choice: ");
        int ch; scanf("%d",&ch); while(getchar()!='\n');
        switch(ch){
            case 1: add_blood_request(); break;
            case 2: view_requests(); break;
            case 3: run=0; break;
            default: printf(RED "  Invalid!\n" RESET);
        }
    }
}

/* ═══════════════════════════════════════════════════════════
 *  MAIN
 * ═══════════════════════════════════════════════════════════ */

int main(void) {
    load_donors();
    load_history();
    load_requests();

    int run=1;
    while(run){
        print_banner();
        printf(WHITE "  Donors: " RED "%d" RESET
               "   Requests: " YELLOW "%d" RESET
               "   Total Donations: " MAGENTA "%d\n\n" RESET,
               donor_count, request_count, history_count);
        printf("  " GREEN  "1." RESET " Donor Management\n");
        printf("  " CYAN   "2." RESET " Donor Search\n");
        printf("  " RED    "3." RESET " Blood Requests\n");
        printf("  " YELLOW "4." RESET " Statistics\n");
        printf("  " MAGENTA"5." RESET " Admin Panel\n");
        printf("  " WHITE  "6." RESET " Exit\n\n");
        printf("  Choice: ");
        int ch; scanf("%d",&ch); while(getchar()!='\n');
        switch(ch){
            case 1: donor_menu(); break;
            case 2: search_menu(); break;
            case 3: request_menu(); break;
            case 4: show_statistics(); break;
            case 5: admin_panel(); break;
            case 6:
                clrscr();
                printf(RED "\n  * Rokto dao, jibon bachao!\n" RESET);
                printf("  Exit...\n\n");
                run=0; break;
            default: printf(RED "  Invalid!\n" RESET);
        }
    }
    return 0;
}
