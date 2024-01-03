"use client"

import { gql, useQuery } from '@apollo/client'
import { Metadata } from "next"
import Image from "next/image"
import dayjs from "dayjs"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import type { users } from 'prisma/client'

 
import { Button } from "@@/components/ui/button"
import { Checkbox } from "@@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@@/components/ui/dropdown-menu"
import { Input } from "@@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@@/components/ui/table"

// import { columns } from "@@/components/datatable/columns"
import { DataTable } from "@@/components/datatable/data-table"
import { UserNav } from "@@/components/datatable/user-nav"
export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
}

const userActiveStatus = {
  "1": "Actived",
  "3": "Canceled",
  "9": "Pending Confirmations",
}

const AllLinksQuery = gql`
  query allLinksQuery($first: Int, $after: ID) {
    users(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          companyId
          email
          firstName
          id
          image
          lastName
          status
          storeSize
          usageSize
          updatedAt
        }
      }
    }
  }
`;

export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "Fullname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fullname
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="lowercase">{`${row.original.firstName} ${row.original.lastName}`}</div>
    }
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center capitalize">status</div>,
    cell: ({ row }) => {
      type UserActiveStatusKey = "1" | "3" | "9";
      const status: UserActiveStatusKey = row.getValue("status")
      return <div className="capitalize text-center">{userActiveStatus[status]}</div>
    },
  },
  {
    accessorKey: "Usage",
    header: () => <div className="text-right capitalize">Usage</div>,
    cell: ({ row }) => {
      return <div className="text-right capitalize">{`${bytesToGigabytes(row.original.usageSize)} / ${bytesToGigabytes(row.original.storeSize)} GB`}</div>
    },
  },
  {
    accessorKey: "updatedAt",
    header: () => <div className="text-right">Last Modified</div>,
    cell: ({ row }) => {
      return <div className="text-right font-medium">{`${dayjs(row.getValue("updatedAt")).format('DD/MM/YYYY')}`}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 w-full">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function MembersPage() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [membersData, setMembersData] = React.useState<users[]>([]);
  const [hasNextPage, setHasNextPage] = React.useState<any>()
  const [endCursor, setEndCursor] = React.useState<string>()

  const { data, loading, error, fetchMore } = useQuery(AllLinksQuery, {
    variables: { first: 500 },
  });

  React.useEffect(() => {
    // When loading is done and there's no error, update the state
    if (!loading && !error && data) {
      setMembersData(data?.users.edges.map(({ node }: { node: users }) => node)); // replace 'someDataKey' with the actual key in your returned data
      const { endCursor, hasNextPage } = data?.users?.pageInfo;
      setHasNextPage(hasNextPage)
      setEndCursor(endCursor)
    }

    // Optionally, handle the error by logging it, showing a user message, etc.
    if (error) {
      console.error('Error fetching data:', error);
    }
  }, [data, loading, error]);
 
  const table = useReactTable({
    data: membersData as any[],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        <DataTable data={membersData} columns={columns} />
      </div>
      {hasNextPage ? (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded my-10"
            onClick={() => {
              fetchMore({
                variables: { after: endCursor },
                updateQuery: (prevResult, { fetchMoreResult }) => {
                  fetchMoreResult.links.edges = [
                    ...prevResult.links.edges,
                    ...fetchMoreResult.links.edges,
                  ];
                  return fetchMoreResult;
                },
              });
            }}
          >
            more
          </button>
      ) : (
        <p className="my-10 text-center font-medium">
          You've reached the end!{" "}
        </p>
      )}
    </>
  )
}



const bytesToGigabytes = (bytes: number): number => {
  const MB = 1024 * 1024;
  const GB = MB * 1024;
  return parseFloat((bytes / GB).toFixed(3));
}
