from datetime import datetime

class IntegrationStatus:
    """Model for integration status"""
    def __init__(self, integration_id, name, connected=False, last_sync=None, error=None):
        self.integration_id = integration_id
        self.name = name
        self.connected = connected
        self.last_sync = last_sync
        self.error = error
    
    def to_dict(self):
        return {
            "integration_id": self.integration_id,
            "name": self.name,
            "connected": self.connected,
            "last_sync": self.last_sync.isoformat() if self.last_sync else None,
            "error": self.error
        }

class GoogleAnalyticsProperty:
    """Model for Google Analytics property"""
    def __init__(self, property_id, display_name, create_time=None, update_time=None):
        self.property_id = property_id
        self.display_name = display_name
        self.create_time = create_time
        self.update_time = update_time
    
    def to_dict(self):
        return {
            "property_id": self.property_id,
            "display_name": self.display_name,
            "create_time": self.create_time,
            "update_time": self.update_time
        }

class MetaAdAccount:
    """Model for Meta Ad Account"""
    def __init__(self, account_id, name, account_status):
        self.account_id = account_id
        self.name = name
        self.account_status = account_status
    
    def to_dict(self):
        return {
            "account_id": self.account_id,
            "name": self.name,
            "account_status": self.account_status
        }

class IntegrationData:
    """Model for integration data"""
    def __init__(self, integration_id, data_type, data, timestamp=None):
        self.integration_id = integration_id
        self.data_type = data_type
        self.data = data
        self.timestamp = timestamp or datetime.now()
    
    def to_dict(self):
        return {
            "integration_id": self.integration_id,
            "data_type": self.data_type,
            "data": self.data,
            "timestamp": self.timestamp.isoformat()
        } 