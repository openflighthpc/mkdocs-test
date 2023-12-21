# Genome Workload
FastQC is a widely used tool for assessing the quality of genome sequence data. It provides a comprehensive overview of various quality metrics that are crucial for ensuring the reliability and accuracy of genomic data. 


## Steps to Execute Job
Assuming that the user possesses only the `bio-users-kubeconfig.yaml` for workload execution, the kubeconfig is configured to exclusively access the `bio` namespace. Consequently, the namespace value has been set to `bio` and queue-name is set to `bio-queue`.

Below is the example manifest file for performing genome quality checks in a Kubernetes cluster.
```yaml
# job.yaml
---
apiVersion: batch/v1
kind: Job
metadata:
  generateName: fastqc-
  namespace: bio
  labels:
    kueue.x-k8s.io/queue-name: bio-queue
spec:
  parallelism: 1
  completions: 1
  suspend: true
  template:
    spec:
      containers:
      - name: dummy-job
        image: openflighthpc/genome:latest
        command: [ "/bin/bash", "-c", "python3 /app/script.py && echo '' && ls / && ls /app/ &&cat /app/sample_data_fastqc.html " ]
        env:
          - name: MINIO_IP
            value: <minio ip like "10.151.15.78">
          - name: MINIO_PORT
            value: <minio port like "31100">
          # Minio Access Key   
          - name: MINIO_AKEY
            value: <minio-access-key like "afdfAdsfslWssedsfsdjE">
          # Minio Secret Key   
          - name: MINIO_SKEY
            value: <minio-secret-key like "Zsfdslfjaslffafddfj">
          - name: BUCKET_NAME
            value: <minio bucket name like "genome">
        resources:
          requests:
            cpu: 500m
            memory: "2000Mi"
      restartPolicy: Never
```

!!! note
    Steps to create minio access key and secret key can be found in minio docs, Follow Link: [minio](./minio.md#create-access-key-and-secret-key).

!!! note
    We are assuming here Kubernetes cluster is active with Minio(or any S3), Kueue and Longhorn(or any storage class) installed.

Command to execute genome in kubernetes cluster using Kueue.

```bash
kubectl --kubeconfig=bio-users-kubeconfig.yaml create -f job.yaml
```

When the job status is Completed then check the S3/minio console to verify results.

!!! note
    For More Information about scripts, Dockerfile and yaml files, Follow Link: [Genome](https://github.com/openflighthpc/hpc-on-k8s/tree/main/workloads/genome)