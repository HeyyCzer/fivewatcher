# FiveWatcher
> **FiveWatcher** makes local development easier by not having to restart resources when you modify them.

## 🚀 Getting Started

Download the latest version of FiveWatcher from the [releases page](https://github.com/heyyczer/watcher/releases).

## ☕ Using FiveWatcher

To use **FiveWatcher**, you only need to execute the following commands in the FXServer console.

```lua
-- give fivewatcher permission to the 'ensure' command
add_principal resource.fivewatcher group.admin
ensure fivewatcher

-- to list available commands
watcher help

-- watch a resource an restart it when updated
watcher w <resource_name>

-- list all watched resources
watcher l

-- stop watching a resource
watcher u <resource_name> 
```
