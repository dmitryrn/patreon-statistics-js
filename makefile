run-local-watch: export DATABASE_URL=postgresql://test:test@localhost:5432/test

.PHONY: run-local-watch
run-local-watch:
	modd

.PHONY: test-functional-watch
test-functional-watch:
	modd -f modd-func.conf

# in case it didn't stop itself
.PHONY: test-functional-down
test-functional-down:
	docker-compose -f ./test-functional/docker-compose.yaml down 
