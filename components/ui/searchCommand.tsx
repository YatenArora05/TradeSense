"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command"
import {Button} from "@/components/ui/button";
import {Loader2,  TrendingUp} from "lucide-react";
import Link from "next/link";
import {searchStocks} from "@/lib/actions/finnhub.actions";

export default function SearchCommand({ renderAs = 'button', label = 'Add stock', initialStocks = [] }: SearchCommandProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? (stocks || []) : (stocks || []).slice(0, 10);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen(v => !v)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const handleSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setStocks(initialStocks);
      setLoading(false);
      return;
    }

    setLoading(true)
    try {
        const results = await searchStocks(term.trim());
        console.log('Search results:', results);
        setStocks(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error('Error searching stocks:', error);
      setStocks([])
    } finally {
      setLoading(false)
    }
  }, [initialStocks]);

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      setSearchTerm("");
      setStocks(initialStocks);
      setLoading(false);
      // Clear any pending search
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [open, initialStocks]);

  // Handle search with debouncing
  useEffect(() => {
    // Don't search if dialog is closed
    if (!open) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // If search term is empty, reset to initial stocks immediately
    if (!searchTerm.trim()) {
      setStocks(initialStocks);
      setLoading(false);
      return;
    }

    // Set new timeout for debounced search
    timeoutRef.current = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm, handleSearch, open, initialStocks]);

  const handleSelectStock = () => {
    setOpen(false);
    setSearchTerm("");
    setStocks(initialStocks);
  }

  return (
    <>
      {renderAs === 'text' ? (
          <span onClick={() => setOpen(true)} className="search-text">
            {label}
          </span>
      ): (
          <Button onClick={() => setOpen(true)} className="search-btn">
            {label}
          </Button>
      )}
      <CommandDialog open={open} onOpenChange={setOpen} className="search-dialog">
        <div className="search-field">
          <CommandInput value={searchTerm} onValueChange={setSearchTerm} placeholder="Search stocks..." className="search-input" />
          {loading && <Loader2 className="search-loader" />}
        </div>
        <CommandList className="search-list">
          {loading ? (
              <CommandEmpty className="search-list-empty">Loading stocks...</CommandEmpty>
          ) : !displayStocks || displayStocks.length === 0 ? (
              <CommandEmpty className="search-list-indicator">
                {isSearchMode ? 'No results found' : 'No stocks available'}
              </CommandEmpty>
            ) : (
            <>
              <div className="search-count">
                {isSearchMode ? 'Search results' : 'Popular stocks'}
                {` `}({displayStocks.length})
              </div>
              {displayStocks.map((stock, i) => (
                  <li key={stock.symbol} className="search-item">
                    <Link
                        href={`/stocks/${stock.symbol}`}
                        onClick={handleSelectStock}
                        className="search-item-link"
                    >
                      <TrendingUp className="h-4 w-4 text-gray-500" />
                      <div  className="flex-1">
                        <div className="search-item-name">
                          {stock.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {stock.symbol} | {stock.exchange } | {stock.type}
                        </div>
                      </div>
                    {/*<Star />*/}
                    </Link>
                  </li>
              ))}
            </>
          )
          }
        </CommandList>
      </CommandDialog>
    </>
  )
}