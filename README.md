
![Frame 2](https://github.com/user-attachments/assets/f086179c-c250-4f49-951e-93335937a6eb)

**FiveWatcher** makes FiveM development easier by not having to restart resources when you modify them.

## 🚀 Getting Started

You can FiveWatcher from [here](https://github.com/HeyyCzer/fivewatcher/releases/download/latest/fivewatcher.zip) or from our [releases page](https://github.com/heyyczer/watcher/releases).

## ☕ Using FiveWatcher

To use **FiveWatcher**, you only need to execute the following commands in the FXServer console.

For allow FiveWatcher to 'ensure' resources, you need to add this line to your `server.cfg`:
```
add_principal resource.fivewatcher group.admin
```
After adding this line, do `ensure fivewatcher`.

### Available Commands
#### `watcher h|help`
List available commands and they function.

#### `watcher w|watch <resource_name>`
Start watching a resource for file changes. If any is found, the resource restarted.

#### `watcher l|list`
List all currently watched resources.

#### `watcher u|unwatch <resource_name>`
Stop watching a resource for file changes.

#### `watcher s|save`
Save and persist the current list of watched resources. They will be loaded on the next time FiveWatcher starts.
