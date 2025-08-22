import requests
import json

# Your Supabase configuration
SUPABASE_URL = "https://bxdvbxnsyrdkhxleruqq.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4ZHZieG5zeXJka2h4bGVydXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NDAxNDMsImV4cCI6MjA3MTIxNjE0M30.2n7pkMDCOh2Gx5IvIjo7vrHlBiizkgkqt5xH3ObH0Sg"  # Replace with your actual anon key

# Edge function endpoint
ENDPOINT = f"{SUPABASE_URL}/functions/v1/super-processor"

def test_edge_function():
    """Test the push token registration edge function"""
    
    # Test data
    test_data = {
        "pushToken": "ExponentPushToken[test-token-12345]",
        "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
        "userId": "0x1234567890abcdef1234567890abcdef12345678"
    }
    
    # Headers
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}"
    }
    
    print("🚀 Testing edge function...")
    print(f"Endpoint: {ENDPOINT}")
    print(f"Data: {json.dumps(test_data, indent=2)}")
    print("-" * 50)
    
    try:
        # Make the request
        response = requests.post(
            ENDPOINT,
            headers=headers,
            json=test_data,
            timeout=30
        )
        
        # Print response details
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        # Try to parse JSON response
        try:
            response_data = response.json()
            print(f"Response JSON: {json.dumps(response_data, indent=2)}")
        except json.JSONDecodeError:
            print(f"Response Text: {response.text}")
        
        # Check if successful
        if response.status_code == 200:
            print("✅ SUCCESS: Edge function worked!")
        else:
            print("❌ ERROR: Edge function failed")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ REQUEST ERROR: {e}")
    except Exception as e:
        print(f"❌ UNEXPECTED ERROR: {e}")

def test_invalid_token():
    """Test with invalid push token to check validation"""
    
    test_data = {
        "pushToken": "InvalidToken123",  # Invalid format
        "walletAddress": "0x1234567890abcdef1234567890abcdef12345678"
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}"
    }
    
    print("\n🧪 Testing invalid push token...")
    print("-" * 50)
    
    try:
        response = requests.post(ENDPOINT, headers=headers, json=test_data)
        print(f"Status Code: {response.status_code}")
        
        try:
            response_data = response.json()
            print(f"Response: {json.dumps(response_data, indent=2)}")
        except:
            print(f"Response Text: {response.text}")
            
        if response.status_code == 400:
            print("✅ SUCCESS: Validation working correctly")
        else:
            print("❌ ERROR: Validation not working as expected")
            
    except Exception as e:
        print(f"❌ ERROR: {e}")

def test_missing_data():
    """Test with missing required fields"""
    
    test_data = {
        "pushToken": "ExponentPushToken[test-token-12345]"
        # Missing walletAddress
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}"
    }
    
    print("\n🧪 Testing missing wallet address...")
    print("-" * 50)
    
    try:
        response = requests.post(ENDPOINT, headers=headers, json=test_data)
        print(f"Status Code: {response.status_code}")
        
        try:
            response_data = response.json()
            print(f"Response: {json.dumps(response_data, indent=2)}")
        except:
            print(f"Response Text: {response.text}")
            
        if response.status_code == 400:
            print("✅ SUCCESS: Required field validation working")
        else:
            print("❌ ERROR: Missing field validation not working")
            
    except Exception as e:
        print(f"❌ ERROR: {e}")

if __name__ == "__main__":
    print("🔧 Supabase Edge Function Test Suite")
    print("=" * 60)
    
    # Check if anon key is set
    if SUPABASE_ANON_KEY == "your-anon-key-here":
        print("❌ Please set your SUPABASE_ANON_KEY in the script!")
        exit(1)
    
    # Run tests
    test_edge_function()
    test_invalid_token()
    test_missing_data()
    
    print("\n🏁 Test complete!")