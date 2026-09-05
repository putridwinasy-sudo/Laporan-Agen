document.addEventListener("DOMContentLoaded", function () {


    // ==========================================
    // ELEMENT HTML
    // ==========================================

    const jenis =
        document.getElementById("jenis");

    const tanggal =
        document.getElementById("tanggal");

    const keterangan =
        document.getElementById("keterangan");

    const nominal =
        document.getElementById("nominal");

    const btnTambah =
        document.getElementById("btnTambah");

    const btnBatal =
        document.getElementById("btnBatal");


    const pemasukanEl =
        document.getElementById("pemasukan");

    const pengeluaranEl =
        document.getElementById("pengeluaran");

    const saldoEl =
        document.getElementById("saldo");


    const daftarTransaksi =
        document.getElementById("daftarTransaksi");


    const tombolSort =
        document.querySelectorAll(".sort-btn");



    // ==========================================
    // DATA TRANSAKSI
    // ==========================================

    let transaksi =
        JSON.parse(
            localStorage.getItem("transaksi")
        ) || [];


    // ==========================================
    // INDEX EDIT
    // ==========================================

    let indexEdit = null;



    // ==========================================
    // DATA SORTING
    // ==========================================

    let sortField = null;

    let sortDirection = "asc";



    // ==========================================
    // TANGGAL HARI INI
    // ==========================================

    function tanggalHariIni() {

        const sekarang =
            new Date();

        const tahun =
            sekarang.getFullYear();

        const bulan =
            String(
                sekarang.getMonth() + 1
            ).padStart(2, "0");

        const hari =
            String(
                sekarang.getDate()
            ).padStart(2, "0");


        return `${tahun}-${bulan}-${hari}`;

    }


    // Set tanggal otomatis

    if (!tanggal.value) {

        tanggal.value =
            tanggalHariIni();

    }



    // ==========================================
    // FORMAT TANGGAL
    // ==========================================

    function formatTanggal(tanggalString) {

        if (!tanggalString) {
            return "-";
        }


        const parts =
            tanggalString.split("-");


        if (parts.length !== 3) {
            return tanggalString;
        }


        return `${parts[2]}/${parts[1]}/${parts[0]}`;

    }



    // ==========================================
    // FORMAT RUPIAH
    // ==========================================

    function formatRupiah(angka) {

        return new Intl.NumberFormat(
            "id-ID",
            {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0
            }
        ).format(
            Number(angka) || 0
        );

    }



    // ==========================================
    // ESCAPE HTML
    // ==========================================

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent =
            text ?? "";

        return div.innerHTML;

    }



    // ==========================================
    // SIMPAN DATA
    // ==========================================

    function simpanData() {

        localStorage.setItem(
            "transaksi",
            JSON.stringify(transaksi)
        );

    }



    // ==========================================
    // UPDATE DASHBOARD
    // ==========================================

    function updateDashboard() {

        let totalPemasukan = 0;

        let totalPengeluaran = 0;


        transaksi.forEach(function (item) {

            if (
                item.jenis ===
                "pemasukan"
            ) {

                totalPemasukan +=
                    Number(item.nominal) || 0;

            }


            else if (
                item.jenis ===
                "pengeluaran"
            ) {

                totalPengeluaran +=
                    Number(item.nominal) || 0;

            }

        });


        const saldo =
            totalPemasukan -
            totalPengeluaran;


        pemasukanEl.textContent =
            formatRupiah(
                totalPemasukan
            );


        pengeluaranEl.textContent =
            formatRupiah(
                totalPengeluaran
            );


        saldoEl.textContent =
            formatRupiah(
                saldo
            );

    }



    // ==========================================
    // SORTING DATA
    // ==========================================

    function transaksiTerurut() {

        const data =
            [...transaksi];


        if (!sortField) {

            return data;

        }


        data.sort(function (a, b) {

            let nilaiA =
                a[sortField];

            let nilaiB =
                b[sortField];


            // ==================================
            // NOMINAL
            // ==================================

            if (
                sortField ===
                "nominal"
            ) {

                nilaiA =
                    Number(nilaiA) || 0;

                nilaiB =
                    Number(nilaiB) || 0;

            }


            // ==================================
            // TANGGAL
            // ==================================

            else if (
                sortField ===
                "tanggal"
            ) {

                nilaiA =
                    new Date(nilaiA)
                        .getTime();

                nilaiB =
                    new Date(nilaiB)
                        .getTime();

            }


            // ==================================
            // TEXT
            // ==================================

            else {

                nilaiA =
                    String(
                        nilaiA ?? ""
                    ).toLowerCase();

                nilaiB =
                    String(
                        nilaiB ?? ""
                    ).toLowerCase();

            }


            if (nilaiA < nilaiB) {

                return sortDirection ===
                    "asc"
                    ? -1
                    : 1;

            }


            if (nilaiA > nilaiB) {

                return sortDirection ===
                    "asc"
                    ? 1
                    : -1;

            }


            return 0;

        });


        return data;

    }



    // ==========================================
    // UPDATE ICON SORT
    // ==========================================

    function updateSortButton() {

        tombolSort.forEach(function (button) {

            const span =
                button.querySelector("span");

            const field =
                button.dataset.sort;


            if (
                field === sortField
            ) {

                span.textContent =
                    sortDirection === "asc"
                        ? "↑"
                        : "↓";

                button.classList.add(
                    "sort-active"
                );

            }

            else {

                span.textContent =
                    "↕";

                button.classList.remove(
                    "sort-active"
                );

            }

        });

    }



    // ==========================================
    // TAMPILKAN TRANSAKSI
    // ==========================================

    function tampilkanTransaksi() {

        daftarTransaksi.innerHTML =
            "";


        // ======================================
        // DATA KOSONG
        // ======================================

        if (
            transaksi.length === 0
        ) {

            daftarTransaksi.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="tidak-ada"
                    >
                        Belum ada transaksi
                    </td>

                </tr>

            `;


            updateDashboard();

            updateSortButton();

            return;

        }



        // ======================================
        // DATA TERURUT
        // ======================================

        const dataTampil =
            transaksiTerurut();



        // ======================================
        // TAMPILKAN DATA
        // ======================================

        dataTampil.forEach(
            function (item) {


                // Cari index asli

                const index =
                    transaksi.indexOf(item);


                const tr =
                    document.createElement("tr");


                // ==================================
                // BARIS SEDANG DIEDIT
                // ==================================

                if (
                    indexEdit === index
                ) {

                    tr.classList.add(
                        "sedang-diedit"
                    );

                }



                // ==================================
                // JENIS
                // ==================================

                const jenisText =
                    item.jenis ===
                    "pemasukan"
                        ? "Pemasukan"
                        : "Pengeluaran";


                const kelasJenis =
                    item.jenis ===
                    "pemasukan"
                        ? "jenis-pemasukan"
                        : "jenis-pengeluaran";



                // ==================================
                // HTML BARIS
                // ==================================

                tr.innerHTML = `

                    <td>
                        ${escapeHTML(
                            formatTanggal(
                                item.tanggal
                            )
                        )}
                    </td>


                    <td>
                        ${escapeHTML(
                            item.keterangan
                        )}
                    </td>


                    <td>

                        <span
                            class="${kelasJenis}"
                        >
                            ${jenisText}
                        </span>

                    </td>


                    <td class="kolom-nominal">

                        ${formatRupiah(
                            item.nominal
                        )}

                    </td>


                    <td>

                        <div
                            class="aksi-container"
                        >

                            <button
                                type="button"
                                class="btn-edit"
                                data-index="${index}"
                            >
                                Edit
                            </button>


                            <button
                                type="button"
                                class="btn-hapus"
                                data-index="${index}"
                            >
                                Hapus
                            </button>

                        </div>

                    </td>

                `;


                daftarTransaksi.appendChild(
                    tr
                );

            }
        );


        updateDashboard();

        updateSortButton();

    }



    // ==========================================
    // SORT BUTTON
    // ==========================================

    tombolSort.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const field =
                    this.dataset.sort;


                // Jika klik kolom yang sama

                if (
                    sortField === field
                ) {

                    sortDirection =
                        sortDirection === "asc"
                            ? "desc"
                            : "asc";

                }


                // Kolom baru

                else {

                    sortField =
                        field;

                    sortDirection =
                        "asc";

                }


                tampilkanTransaksi();

            }
        );

    });



    // ==========================================
    // TAMBAH / UPDATE
    // ==========================================

    btnTambah.addEventListener(
        "click",
        function () {


            const jenisValue =
                jenis.value;


            const tanggalValue =
                tanggal.value;


            const keteranganValue =
                keterangan.value.trim();


            const nominalValue =
                nominal.value.replace(
                    /\D/g,
                    ""
                );


            const nominalNumber =
                Number(
                    nominalValue
                );



            // ==================================
            // VALIDASI TANGGAL
            // ==================================

            if (!tanggalValue) {

                alert(
                    "Tanggal transaksi belum dipilih."
                );

                tanggal.focus();

                return;

            }



            // ==================================
            // VALIDASI KETERANGAN
            // ==================================

            if (
                keteranganValue === ""
            ) {

                alert(
                    "Keterangan transaksi belum diisi."
                );

                keterangan.focus();

                return;

            }



            // ==================================
            // VALIDASI NOMINAL
            // ==================================

            if (
                nominalValue === "" ||
                isNaN(nominalNumber) ||
                nominalNumber <= 0
            ) {

                alert(
                    "Nominal harus diisi dengan benar."
                );

                nominal.focus();

                return;

            }



            // ==================================
            // MODE EDIT
            // ==================================

            if (
                indexEdit !== null
            ) {

                transaksi[indexEdit].jenis =
                    jenisValue;


                transaksi[indexEdit].tanggal =
                    tanggalValue;


                transaksi[indexEdit].keterangan =
                    keteranganValue;


                transaksi[indexEdit].nominal =
                    nominalNumber;


                alert(
                    "Transaksi berhasil diperbarui."
                );


                indexEdit = null;


                btnTambah.textContent =
                    "Tambah Transaksi";


                btnBatal.style.display =
                    "none";


                const form =
                    document.querySelector(
                        ".form-container"
                    );


                if (form) {

                    form.classList.remove(
                        "mode-edit"
                    );

                }

            }



            // ==================================
            // MODE TAMBAH
            // ==================================

            else {

                const transaksiBaru = {

                    id:
                        Date.now(),

                    tanggal:
                        tanggalValue,

                    keterangan:
                        keteranganValue,

                    jenis:
                        jenisValue,

                    nominal:
                        nominalNumber

                };


                transaksi.push(
                    transaksiBaru
                );


                alert(
                    "Transaksi berhasil ditambahkan."
                );

            }



            // ==================================
            // SIMPAN
            // ==================================

            simpanData();



            // ==================================
            // RESET FORM
            // ==================================

            jenis.value =
                "pemasukan";


            tanggal.value =
                tanggalHariIni();


            keterangan.value =
                "";


            nominal.value =
                "";



            // ==================================
            // REFRESH
            // ==================================

            tampilkanTransaksi();

        }
    );



    // ==========================================
    // EDIT / HAPUS
    // ==========================================

    daftarTransaksi.addEventListener(
        "click",
        function (event) {

            const target =
                event.target;



            // ==================================
            // EDIT
            // ==================================

            if (
                target.classList.contains(
                    "btn-edit"
                )
            ) {

                const index =
                    Number(
                        target.dataset.index
                    );


                const data =
                    transaksi[index];


                if (!data) {

                    return;

                }



                // ==================================
                // ISI FORM
                // ==================================

                jenis.value =
                    data.jenis;


                tanggal.value =
                    data.tanggal ||
                    tanggalHariIni();


                keterangan.value =
                    data.keterangan || "";


                nominal.value =
                    Number(
                        data.nominal
                    ).toLocaleString(
                        "id-ID"
                    );



                // ==================================
                // INDEX EDIT
                // ==================================

                indexEdit =
                    index;



                // ==================================
                // UBAH TOMBOL
                // ==================================

                btnTambah.textContent =
                    "Simpan Perubahan";


                btnBatal.style.display =
                    "block";



                // ==================================
                // MODE EDIT
                // ==================================

                const form =
                    document.querySelector(
                        ".form-container"
                    );


                if (form) {

                    form.classList.add(
                        "mode-edit"
                    );

                }



                // ==================================
                // REFRESH
                // ==================================

                tampilkanTransaksi();



                // ==================================
                // SCROLL
                // ==================================

                if (form) {

                    form.scrollIntoView({

                        behavior:
                            "smooth",

                        block:
                            "start"

                    });

                }


                keterangan.focus();

            }



            // ==================================
            // HAPUS
            // ==================================

            if (
                target.classList.contains(
                    "btn-hapus"
                )
            ) {

                const index =
                    Number(
                        target.dataset.index
                    );


                const data =
                    transaksi[index];


                if (!data) {

                    return;

                }



                const yakin =
                    confirm(
                        `Hapus transaksi "${data.keterangan}"?`
                    );


                if (!yakin) {

                    return;

                }



                // ==================================
                // HAPUS DATA
                // ==================================

                transaksi.splice(
                    index,
                    1
                );



                // ==================================
                // PERBAIKI INDEX EDIT
                // ==================================

                if (
                    indexEdit !== null
                ) {

                    if (
                        indexEdit === index
                    ) {

                        batalkanEdit();

                    }

                    else if (
                        indexEdit > index
                    ) {

                        indexEdit--;

                    }

                }



                // ==================================
                // SIMPAN
                // ==================================

                simpanData();


                tampilkanTransaksi();

            }

        }
    );



    // ==========================================
    // FORMAT NOMINAL
    // ==========================================

    nominal.addEventListener(
        "input",
        function () {

            let angka =
                this.value.replace(
                    /\D/g,
                    ""
                );


            if (
                angka === ""
            ) {

                this.value =
                    "";

                return;

            }


            this.value =
                Number(
                    angka
                ).toLocaleString(
                    "id-ID"
                );

        }
    );



    // ==========================================
    // BATAL EDIT
    // ==========================================

    btnBatal.addEventListener(
        "click",
        function () {

            batalkanEdit();

        }
    );



    function batalkanEdit() {

        indexEdit = null;


        btnTambah.textContent =
            "Tambah Transaksi";


        btnBatal.style.display =
            "none";


        jenis.value =
            "pemasukan";


        tanggal.value =
            tanggalHariIni();


        keterangan.value =
            "";


        nominal.value =
            "";



        const form =
            document.querySelector(
                ".form-container"
            );


        if (form) {

            form.classList.remove(
                "mode-edit"
            );

        }


        tampilkanTransaksi();

    }



    // ==========================================
    // ENTER KETERANGAN
    // ==========================================

    keterangan.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                nominal.focus();

            }

        }
    );



    // ==========================================
    // ENTER NOMINAL
    // ==========================================

    nominal.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                btnTambah.click();

            }

        }
    );



    // ==========================================
    // LOAD DATA
    // ==========================================

    tampilkanTransaksi();

});
