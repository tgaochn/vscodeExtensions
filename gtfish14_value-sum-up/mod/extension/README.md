# gtfish14_value-sum-up

Calculate and display statistics (sum, average, min, max) for selected numeric values directly in the VS Code status bar.

## Features

- **Multi-selection support**: Select numbers across multiple selections and see aggregated statistics
- **Sum calculation**: Automatically sums all numeric values found in the selection
- **Average calculation**: Displays the average of all selected numbers
- **Min/Max display**: Shows the minimum and maximum values in the selection
- **Line count**: Displays the number of selected lines for multi-line selections
- **Smart number formatting**: Rounds to 2 decimal places; switches to exponential notation for large numbers
- **Status bar integration**: Results appear in the left side of the VS Code status bar
- **Real-time updates**: Statistics update instantly as you change your selection
- **Integer and float detection**: Recognizes both integers and decimal numbers, including negative values

## How It Works

Select any text containing numbers in your editor. The status bar will automatically display:
- Line count (for multi-line selections)
- Sum and Average of all detected numbers
- Min and Max values (when space permits)

## Key Modifications from Original

- Added average, min, and max statistics (original only showed sum)
- Improved number detection regex for more accurate parsing
- Added multi-selection support for aggregating across disjoint selections
- Smart formatting with exponential notation for very large or very small numbers
- Added line count display for multi-line selections

## Attribution

Based on [code-sum-up](https://marketplace.visualstudio.com/items?itemName=ArturoCarvalho.code-sum-up) by arturcarvalho. Independently modified and maintained.
