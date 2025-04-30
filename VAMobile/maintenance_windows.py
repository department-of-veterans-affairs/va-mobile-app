import http.client
import json
import time
import os

API_KEY = os.environ.get('API_KEY')

# Creating client to make API calls
conn = http.client.HTTPSConnection("api.pagerduty.com")
#
headers = {
    'Accept': "application/json",
    'Content-Type': "application/json",
    'Authorization': API_KEY
}

def service_to_add():
    retries = 3
    delay = 1
    add_services = []
    for attempt in range(retries):
        try:
            conn = http.client.HTTPSConnection("api.pagerduty.com")
            conn.request("GET","/services?query=Mobile", headers=headers)
            sresponse = conn.getresponse()
            if sresponse.status == 200:
                srv_list = sresponse.read().decode('utf-8')
                service_to_add = json.loads(srv_list)
                service_list = service_to_add.get('services')
                if service_list:
                    for service in service_list:
                        service_id = service.get('id')
                        service_type = service.get('type')
                        service_name = service.get('summary')
                        if service_id and service_name:
                            add_services.append({
                                'id': service_id,
                                'type': service_type,
                                'name': service_name
                            })
                conn.close()
                return add_services
            else:
                print("ERROR! Service not found...")
                conn.close()
        except (http.client.HTTPException, URLError) as e:
            print(f"Attempt {attempt + 1}: {e}")
            if 'conn' in locals():
                conn.close()
        if attempt < retries - 1:
            print(f"Retrying in {delay} seconds...")
            time.sleep(delay)
            delay *= 2
        else:
            print(f"Failed to after {retries} attempts.")
            return []

def list_maint_windows():
    retries = 3
    delay = 1
    search_word = 'TESTService1'
    for attempt in range(retries):
        try:
            conn = http.client.HTTPSConnection("api.pagerduty.com")
            conn.request("GET","/maintenance_windows?filter=future", headers=headers)
            mresponse = conn.getresponse()
            if mresponse.status == 200:
                mw_list = mresponse.read().decode('utf-8')
                mw_data = json.loads(mw_list)
                mw_list = mw_data.get('maintenance_windows')
                future_windows = []
                count = 0

                if mw_list:
                    for item in mw_list:
                        if 'services' in item:
                            found_service = False
                            for service in item['services']:
                                if 'summary' in service and search_word in service['summary']:
                                    found_service = True
                                    count += 1
                                    break
                            if found_service:
                                future_windows.append({
                                    'services': item.get('services'),
                                    'start_time': item.get('start_time'),
                                    'end_time': item.get('end_time'),
                                    'id': item.get('id'),
                                    'description': item.get('description')
                                })
                conn.close()
                return future_windows, count
            else:
                print(f"Attempt {attempt + 1} - Error in list_maint_windows(): {mresponse.status}")
                conn.close()
        except (http.client.HTTPException, URLError) as e:
            print(f"Attempt {attempt + 1} - Exception in list_maint_windows(): {e}")
            if 'conn' in locals():
                conn.close()
        if attempt < retries - 1:
            print(f"Retrying list_maint_windows() in {delay} seconds...")
            time.sleep(delay)
            delay *= 2
        else:
            print(f"Failed to list_maint_windows() after {retries} attempts.")
            return [], 0  

# Updating Maintenance windows to add the service
def update_maint_window():
    future_windows, count = list_maint_windows()
    if future_windows:
        print(f"Checking and updating {count} maintenance window(s)")
        query1 = "TESTService1"
        query2 = "TESTService2"
        services_to_add = service_to_add()

        for i, window in enumerate(future_windows):
            if not isinstance(window, dict):
                print(f"Error: Encountered a non-dictionary item at index {i} in future_windows")
                continue

            window_id = window.get('id')
            start_time = window.get('start_time')
            end_time = window.get('end_time')
            desc = window.get('description')
            existing_services = window.get('services', [])
            existing_service_names = {srv.get('summary') for srv in existing_services if srv.get('summary')}
            existing_service_ids = {srv.get('id') for srv in existing_services if srv.get('id')}

            print(f"\nProcessing window {i+1} with ID: {window_id}, Description: {desc}")

            has_query1 = any(query1 in name for name in existing_service_names)
            has_query2 = any(query2 in name for name in existing_service_names)

            if has_query2:
                print(f"  {query2} is already applied. No update needed for this window.")
                continue

            elif has_query1 and not has_query2:
                print(f"  {query1} is applied, and {query2} is not. Adding {query2} services.")
                updated_services = list(existing_services)
                for service_to_add_item in services_to_add:
                    if test2_query in service_to_add_item.get('name', '') and service_to_add_item.get('id') not in existing_service_ids:
                        updated_services.append({'id': service_to_add_item['id'], 'type': 'service_reference'})

                payload = {
                    "maintenance_window": {
                        "type": "maintenance_window",
                        "start_time": start_time,
                        "end_time": end_time,
                        "description": desc,
                        "services": updated_services
                    }
                }
                json_payload = json.dumps(payload)

                retries = 3
                delay = 1
                for attempt in range(retries):
                    try:
                        conn = http.client.HTTPSConnection("api.pagerduty.com")
                        conn.request("PUT", f"/maintenance_windows/{window_id}", json_payload, headers)
                        uresp = conn.getresponse()
                        # response_body = uresp.read().decode('utf-8')
                        print(f"  Attempt {attempt + 1} Update Response for {window_id} - Status: {uresp.status}")
                        if 200 <= uresp.status < 300:
                            print(f"  Successfully added {query2} services to {window_id} after {attempt + 1} attempts")
                            break
                        else:
                            print(f"  Error updating {window_id}. Status: {uresp.status}")
                    except (http.client.HTTPException, URLError) as e:
                        print(f"  Attempt {attempt + 1} - Error updating {window_id}: {e}")
                    finally:
                        if 'conn' in locals():
                            conn.close()

                    if attempt < retries - 1:
                        print(f"  Retrying in {delay} seconds...")
                        time.sleep(delay)
                        delay *= 2

                else:
                    print(f"  Failed to update {window_id} after {retries} attempts.")
    else:
        print("No future maintenance windows found to check.")

future_windows, count = list_maint_windows()
add_services = service_to_add()
update_maint_window()
