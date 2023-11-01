<script>
    import axios from "axios";
    import { User, clickOutside } from "../../Components/helper";
    import Modal from "../../Components/Modal.svelte";
    import { sync } from "../../Database/schema";
    import dayjs from "dayjs";
    import { goto } from "$app/navigation";

    export let path = "/pemuda";

    let active_dropdown_menu = ""; 
    let active_mobile_menu = location.pathname;
    let active_menu_mobile = false;
    let menus = [
        {
            path: "/home",
            title: "Home",
        },
        {
            title: "SDM",
            show: false,
            submenu: [
                {
                    path: "/anggota",
                    title: "Anggota",
                },
                {
                    path: "/hu",
                    title: "HU",
                },
                {
                    path: "/upgrade",
                    title: "Upgrade",
                },
                {
                    path: "/mutasi",
                    title: "Mutasi",
                },
            ],
        },

        {
            title: "Aktivitas Internal",
            submenu: [
                {
                    path: "/hm",
                    title: "HM",
                }, 
                {
                    path: "/mal",
                    title: "Mal",
                },
                {
                    path: "/omoo",
                    title: "Omoo",
                },
                {
                    path: "/hs",
                    title: "HS",
                },
                {
                    path: "/jm",
                    title: "JM",
                },
            ],
        },
        {
            title: "Rekrutmen",
            submenu: [
                {
                    path: "/kontak",
                    title: "Kontak",
                },
                {
                    path: "/daurah",
                    title: "Daurah",
                },
            ],
        },
        {
            title: "Aktivitas Eksternal",
            submenu: [
                {
                    path: "/ku",
                    title: "KU",
                },
                {
                    path: "/kr",
                    title: "KR",
                },
                {
                    path: "/kj",
                    title: "KJ",
                },
                {
                    path: "/km",
                    title: "KM",
                },
            ],
        },

        {
            title: "Pengurus",
            submenu: [
                {
                    path: "/rapat",
                    title: "Rapat",
                },
                {
                    path: "/anggaran",
                    title: "Anggaran",
                },
                {
                    path: "/admin",
                    title: "Admin",
                },
                {
                    path: "/laporan",
                    title: "Laporan",
                },
            ],
        },
    ];

    axios.get("/auth/user",{
        headers: {
            Authorization: "Bearer " + localStorage.getItem("session_id"),
        },
    }).then((response) => {
        const user = response.data;

        User.set(user);

        sync();

        if (!user.Pin) {
            return goto("/pin");
        }

        // redirect to pin if login more than 1 hour

        if (dayjs().isAfter(dayjs(user.LoginAt).add(1, "hour"))) {
            console.log("need pin");
            return goto("/pin");
        }
    });
</script>

<div class="text-orange-500" />
<header class="max-w-7xl overflow-auto mx-auto p-6 bg-white">
    <nav aria-label="Global" class=" ">
        <ul class="hidden md:flex items-center gap-6 text-sm">
            {#each menus as menu}
                {#if menu.submenu}
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div
                        class="relative"
                        use:clickOutside
                        on:click_outside={() => {
                            active_dropdown_menu = "";
                        }}
                        on:mouseenter={() => {
                            active_dropdown_menu = menu.title;
                        }}
                        on:mouseleave={(e) => {
                            if (e.toElement.id != "slot-container") {
                                active_dropdown_menu = "";
                            }
                        }}
                    >
                        <div
                            class="inline-flex items-center overflow-hidden rounded-md bg-white"
                        >
                            <button
                                class="flex gap-2 py-2 text-sm/none text-gray-600"
                            >
                                <span> {menu.title}</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-4 w-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                        {#if active_dropdown_menu == menu.title}
                            <div
                                class="absolute z-50 mt-2 w-56 rounded-md border border-gray-100 bg-white shadow-lg"
                                role="menu"
                            >
                                <div class="p-2">
                                    {#each menu.submenu as item}
                                        <a
                                            href={item.path}
                                            class="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                            role="menuitem"
                                        >
                                            {item.title}
                                        </a>
                                    {/each}
                                </div>
                            </div>
                        {/if}
                    </div>
                {:else}
                    <li>
                        <a
                            class="{path == menu.path
                                ? 'border-b-2 pb-1 mt-1 border-orange-500'
                                : ''} inline-flex items-center overflow-hidden bg-white text-sm/none text-gray-600"
                            href={menu.path}
                        >
                            {menu.title}
                        </a>
                    </li>
                {/if}
            {/each}
            <div />
        </ul>

        <ul class="md:hidden items-center gap-6 text-sm">
            <div class="flex justify-end">
                <button
                    on:click={() => {
                        active_menu_mobile = true;
                    }}
                    class=""
                    ><svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                    </svg>
                </button>
            </div>
        </ul>
    </nav>
    <div id="slot-container" class="min-h-screen pt-5">
        <slot />
    </div>
</header>
<Modal bind:show={active_menu_mobile} title="Menu">
    <div class="">
        <!-- Simple Navigation with Extras -->
        <nav class="space-y-1">
            {#each menus as menu}
                {#if menu.submenu}
                    <div>
                        <div
                            class="px-3 pt-5 pb-2 text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                            {menu.title}
                        </div>

                        {#each menu.submenu as item}
                            <a
                                href={item.path}
                                on:click={() => {
                                    active_menu_mobile = false;
                                }}
                                class="{active_mobile_menu == item.path
                                    ? 'bg-gray-100'
                                    : ''} flex items-center space-x-3 px-3 font-medium rounded text-gray-700"
                            >
                                <span class="py-2 grow">{item.title}</span>
                            </a>
                        {/each}
                    </div>
                {:else}
                    <a
                        href={menu.path}
                        on:click={() => {
                            active_menu_mobile = false;
                        }}
                        class="{active_mobile_menu == menu.path
                            ? 'bg-gray-100'
                            : 'bg-white'} flex items-center space-x-3 px-3 font-medium rounded text-gray-700"
                    >
                        <span class="py-2 grow">Dashboard</span>
                    </a>
                {/if}
            {/each}
        </nav>
        <!-- END Simple Navigation with Extras -->
    </div>
</Modal>
