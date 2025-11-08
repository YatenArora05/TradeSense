'use client';

import { useState, useTransition } from 'react';
import { addToWatchlist, removeFromWatchlist } from '@/lib/actions/watchlist.actions';
import { Button } from './button';
import { Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function WatchlistButton({
  symbol,
  company,
  isInWatchlist: initialIsInWatchlist,
  showTrashIcon = false,
  type = 'button',
  onWatchlistChange,
}: WatchlistButtonProps) {
  const [isInWatchlist, setIsInWatchlist] = useState(initialIsInWatchlist);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      try {
        if (isInWatchlist) {
          const result = await removeFromWatchlist(symbol);
          if (result.success) {
            setIsInWatchlist(false);
            toast.success(`${symbol} removed from watchlist`);
            onWatchlistChange?.(symbol, false);
          } else {
            toast.error(result.error || 'Failed to remove from watchlist');
          }
        } else {
          const result = await addToWatchlist(symbol, company);
          if (result.success) {
            setIsInWatchlist(true);
            toast.success(`${symbol} added to watchlist`);
            onWatchlistChange?.(symbol, true);
          } else {
            toast.error(result.error || 'Failed to add to watchlist');
          }
        }
      } catch (error) {
        console.error('Watchlist toggle error:', error);
        toast.error('An error occurred');
      }
    });
  };

  if (type === 'icon') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        disabled={isPending}
        className={`watchlist-icon-btn ${isInWatchlist ? 'watchlist-icon-added' : ''}`}
        aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
      >
        {showTrashIcon && isInWatchlist ? (
          <Trash2 className="trash-icon" />
        ) : (
          <Star className={`star-icon ${isInWatchlist ? 'watchlist-icon-added' : ''}`} />
        )}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleToggle}
      disabled={isPending}
      className={`watchlist-btn ${isInWatchlist ? 'watchlist-remove' : ''}`}
    >
      {isPending ? (
        'Loading...'
      ) : isInWatchlist ? (
        showTrashIcon ? (
          <>
            <Trash2 className="h-4 w-4" />
            Remove from Watchlist
          </>
        ) : (
          'Remove from Watchlist'
        )
      ) : (
        <>
          <Star className="h-4 w-4" />
          Add to Watchlist
        </>
      )}
    </Button>
  );
}

