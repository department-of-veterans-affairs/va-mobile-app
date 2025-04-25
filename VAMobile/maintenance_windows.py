import pagerduty
import os

API_KEY = os.environ.get('PAGERDUTY_API_KEY')

# Creating client and making api call
client = pagerduty.RestApiV2Client(API_KEY)


# Listing all services
services = client.list_all('services')
# Getting service details
#NOTE This may not be needed anymore
def get_services(): 
    search = "TESTService1"
    found_services = []
    for item in services:
        if 'name' in item and search in item['name']:
            found_services.append({
                "id": item['id'],
                "name": item["name"]
            })
    return found_services

service_data = get_services()
if service_data:
    for item in service_data:
        service_name = (item['name'])
        service_id = (item['id'])
else:
    print(f"No services matching {search}")

# Locating service to add to maintenance window
def service_to_add():
    search = "TESTService2"
    add_services = []
    for item in services:
        if 'name' in item and search in item['name']:
            added_service_id = item['id']
            add_services.append({
                "id": item['id'],
                "type": item['type'],
            })
    return add_services, added_service_id

# Creating variables to use later on in the script
add_services, added_service_id = service_to_add()

# List Maintenance Windows That are future
def list_maint_windows():
    current_services = []
    start_time = None
    end_time = None
    mid = None
    name = None

    try: 
        data = client.rget('/maintenance_windows?filter=future')
        search_word = "TESTService1"
        if data:
            for item in data:
                if 'services' in item:
                    for service in item['services']:
                        if 'summary' in service and search_word in service['summary']:
                            current_services.append(item['services'])
                            start_time = item.get('start_time')
                            end_time = item.get('end_time')
                            mid = item.get('id')
                            description = item.get('description')
                            return current_services, start_time, end_time, mid, description
                else:
                    print("No future services")
            if not current_services:
                print(f"No future maintenance windows found containing {search_word}")
        else:
            print("WARNING No data returned")
            return [], None, None, None, None
    except Exception as e:
        print(f"Error fetching maintenance windows: {e}")
        return [], None, None, None, None
    return current_services, start_time, end_time, mid, description

# Creating variables to use later on in the script
current_services, start, end, mid, description = list_maint_windows()

# Updating the maintenance window to include test2
def update_maint_window():
    if current_services:
        print(f"Updating maintenance window Name: {description} ID: {mid}")
        current_services.append(add_services)
        service_list = sum(current_services, [])
        client.rput(f"/maintenance_windows/{mid}", json={
            'maintenance_window':{
              'start_time': start,
              'end_time': end,
              'services': service_list
            }
        })
    else:
        print("No maintenance windows to update")

update_maint_window()
