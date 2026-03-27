import os

def download_and_prepare():
    # Make sure we're writing to the right place if executed from anywhere
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_dir = os.path.join(base_dir, "data", "raw")
    os.makedirs(target_dir, exist_ok=True)
    
    print(f"[DOWNLOAD] Target directory: {target_dir}")
    
    try:
        import kaggle
    except OSError as e:
        print("[DOWNLOAD] Kaggle credentials missing or invalid permissions:")
        print("Please ensure kaggle.json is placed in your ~/.kaggle/ directory and try again.")
        print(f"Error details: {e}")
        return
    except Exception as e:
        print(f"[DOWNLOAD] Exception occurred importing Kaggle module: {e}")
        return
        
    try:
        # Download cloud pricing dataset
        print("[DOWNLOAD] Downloading 'infinator/cloud-computing-prices-2023'...")
        kaggle.api.dataset_download_files(
            'infinator/cloud-computing-prices-2023',
            path=target_dir, unzip=True
        )
        
        # Download cloud costs dataset  
        print("[DOWNLOAD] Downloading 'rakkesharv/aws-cost-explorer-data'...")
        kaggle.api.dataset_download_files(
            'rakkesharv/aws-cost-explorer-data',
            path=target_dir, unzip=True
        )
        
        print(f"[DOWNLOAD] Datasets successfully downloaded to {target_dir}")
        print("[DOWNLOAD] Please manually map columns to cloud_company_profiles.csv if needed.")
    except Exception as e:
        print(f"[DOWNLOAD] Could not download datasets from Kaggle. Error: {e}")

if __name__ == "__main__":
    download_and_prepare()
