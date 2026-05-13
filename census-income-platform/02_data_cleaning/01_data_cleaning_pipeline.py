# Databricks notebook source
from pyspark.sql.functions import *

# COMMAND ----------

df = spark.read.table("workspace.default.census_data_raw")

display(df.limit(5))

# COMMAND ----------

df = df.toDF(*[col.lower() for col in df.columns])

print(df.columns)

# COMMAND ----------

df = df.select([
    trim(col(c)).alias(c)
    for c in df.columns
])

display(df.limit(5))

# COMMAND ----------

df = df.withColumn(
    "age",
    regexp_replace(col("age"), "[^0-9]", "")
)

df = df.withColumn(
    "age",
    col("age").cast("integer")
)

# COMMAND ----------

df = df.withColumn(
    "education-num",
    regexp_replace(col("education-num"), "[^0-9.]", "")
)

df = df.withColumn(
    "education-num",
    col("education-num").cast("double")
)

# COMMAND ----------

df = df.withColumn(
    "hours-per-week",
    regexp_replace(col("hours-per-week"), "[^0-9.]", "")
)

df = df.withColumn(
    "hours-per-week",
    col("hours-per-week").cast("double")
)

# COMMAND ----------

df = df.withColumn(
    "capital-gain",
    regexp_replace(col("capital-gain"), "[^0-9.]", "")
)

df = df.withColumn(
    "capital-gain",
    col("capital-gain").cast("double")
)

# COMMAND ----------

df = df.withColumn(
    "capital-loss",
    regexp_replace(col("capital-loss"), "[^0-9.]", "")
)

df = df.withColumn(
    "capital-loss",
    col("capital-loss").cast("double")
)

# COMMAND ----------

df.printSchema()

# COMMAND ----------

from pyspark.sql.functions import mean

# COMMAND ----------

from pyspark.sql.functions import *


age_median = df.approxQuantile("age", [0.5], 0)[0]

hours_median = df.approxQuantile("hours-per-week", [0.5], 0)[0]

education_median = df.approxQuantile("education-num", [0.5], 0)[0]



df = df.fillna({
    "age": age_median,
    "education-num": education_median,
    "hours-per-week": hours_median,
    "capital-gain": 0,
    "capital-loss": 0
})



df = df.fillna({
    "workclass": "Unknown",
    "education_level": "Unknown",
    "marital-status": "Unknown",
    "occupation": "Unknown",
    "relationship": "Unknown",
    "race": "Unknown",
    "sex": "Unknown",
    "native-country": "Unknown",
    "income": "Unknown",
    "random_flag": "Unknown",
    "source_system": "Unknown"
})



null_counts = df.select([
    count(
        when(col(c).isNull(), c)
    ).alias(c)
    for c in df.columns
])

display(null_counts)

# COMMAND ----------

# MAGIC %md
# MAGIC normalize income label

# COMMAND ----------

df = df.withColumn(
    "income",
    when(lower(trim(col("income"))).isin("<=80k", "<=80k."), "<=80K")
    .when(lower(trim(col("income"))).isin(">80k", ">80k."), ">80K")
    .otherwise("Unknown")
)

display(df.select("income").limit(20))

# COMMAND ----------

df.select("income").distinct().show()

# COMMAND ----------

# MAGIC %md
# MAGIC remove duplicate rows

# COMMAND ----------

before_count = df.count()

df = df.dropDuplicates()

after_count = df.count()

print("Before:", before_count)
print("After :", after_count)
print("Duplicates Removed:", before_count - after_count)

# COMMAND ----------

df.write.format("delta") \
    .mode("overwrite") \
    .saveAsTable("workspace.default.census_cleaned")

# COMMAND ----------

clean_df = spark.read.table("workspace.default.census_cleaned")

display(clean_df)